import { Injectable, BadRequestException } from "@nestjs/common";
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import * as https from 'https';
import * as shajs from 'sha.js';
import * as nodeRSA from 'node-rsa';
import { FileService } from "../file/file.service";
import { AccessResponse } from "../../dto/accountancy/accessResponse.dto";
import { TransactionDTO } from "../../dto/accountancy/transaction.dto";
import { Mutation } from "../../entities/accountancy/mutation.entity";
import moment = require("moment");

@Injectable()
export class AccountancyService {
    private tokenExpired: Date = new Date();

    constructor (
        private readonly fileService: FileService,
    ) {}

    public async updateMutations(): Promise<void> {
        if (this.fileService.getAccessTokenAccountancy() === '') {
            throw new BadRequestException('Accountancy is not activated...');
        }

        const transactions = await this.obtainTransactions();
        for (const transaction of transactions.transactions.booked) {
            // Only add a transaction if there is not a mutation of it
            if (!(await Mutation.findOne({where: { entryReference: transaction.entryReference}}))) {
                console.log(transaction)
                const mutation = new Mutation();
                mutation.entryReference = transaction.entryReference;
                mutation.amount = parseFloat(transaction.transactionAmount.amount);
                mutation.debtorIban = transaction.debtorAccount.iban;
                mutation.date = moment(transaction.raboBookingDateTime, 'YYYY-MM-DD').toDate();
                mutation.description = transaction.initiatingPartyName + ' ' + transaction.remittanceInformationUnstructured;
        
                // TODO: Need to develop an automated way of importing transactions
                mutation.imported = false;
                mutation.incomeStatement = null;
                mutation.paymentMethod = null;

                await mutation.save();
            }
          }
    }

    private async obtainTransactions(): Promise<TransactionDTO> {
        if (new Date().getTime() > this.tokenExpired.getTime()) {
            // Refresh rabo-token
            const token: AccessResponse = (await axios.post(process.env.RABOBANK_URL + '/oauth2/token',
                                'grant_type=refresh_token&refresh_token=' + this.fileService.getRefreshTokenAccountancy(),
                                { headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'Authorization': 'Basic ' + Buffer.from(process.env.RABOBANK_CLIENT_ID + ':' + process.env.RABOBANK_CLIENT_SECRET).toString('base64'),
                                }},
                            )).data;

            // Update tokens
            this.fileService.saveAccessTokenAccountancy(token.access_token);
            this.fileService.saveRefreshTokenAccountancy(token.refresh_token);

            // Update refresh time
            this.tokenExpired = new Date((token.consented_on + token.expires_in)*1000);
        }

        const response = (await axios.get(`${process.env.RABOBANK_URL}/payments/account-information/ais/v3/accounts/${this.fileService.getResourceIdAccountancy()}/transactions?bookingStatus=booked`,
            { headers: this.getHttpsHeader(
                        this.fileService.getAccessTokenAccountancy(),
                        this.fileService.getCertificate(),
                        this.fileService.getPrivateKey(),
                        process.env.RABOBANK_CLIENT_ID,
                        +process.env.RABOBANK_CERTIFICATE_KEY_ID
                    ),
            httpsAgent: this.getAccountancyHttpAgent(),
        })).data;

        return response;
    }

    public generateDigest(body: string): string {
        return 'sha-512=' + shajs('sha512').update(body).digest('base64');
    }
    
    public generateSignature(signatureString: string, headers: string, privateKey: Buffer, keyId: number): string {
        const key = new nodeRSA(privateKey, 'pkcs8', {signingScheme: 'pkcs1-sha512'});

        const signedSignature = key.sign(Buffer.from(signatureString), 'base64');
        return `keyId="${keyId}",algorithm="rsa-sha512",headers="${headers}",signature="${signedSignature}"`;
    }

    public getAccountancyHttpAgent(): https.Agent {
        return new https.Agent({
            rejectUnauthorized: false,
            cert: this.fileService.getCertificate(),
            key: this.fileService.getPrivateKey(),
        });
    }

    public getHttpsHeader(accessToken: string, certificate: Buffer, privateKey: Buffer, clientId: string, certificateId: number) {
        const currentDate = (new Date()).toUTCString();
        const digest = this.generateDigest('');
        const requestId = uuid();
        const signingString = 'date: ' + currentDate + '\ndigest: ' + digest + '\nx-request-id: ' + requestId;
        const signature = this.generateSignature(signingString, 'date digest x-request-id', privateKey, certificateId);

        return {
            'Authorization': 'Bearer ' + accessToken,
            'date': currentDate,
            'x-request-id': requestId,
            'digest': digest,
            'signature': signature,
            'tpp-signature-certificate': certificate.toString('utf8').replace(/\r?\n|\r/g, '').substr(27, 1224),
            'x-ibm-client-id': clientId,
        };
    }
}