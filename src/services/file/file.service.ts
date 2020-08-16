import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
    private readonly pathAccountancyAccessToken: string = process.env.STORAGE_PATH + FileType.ACCOUNTANCY + 'accessToken.txt';
    private readonly pathAccountancyRefreshToken: string = process.env.STORAGE_PATH + FileType.ACCOUNTANCY + 'refreshToken.txt';
    private readonly pathAccountancyResourceId: string = process.env.STORAGE_PATH + FileType.ACCOUNTANCY + 'resourceId.txt';
    private readonly pathAccountancyCertificate: string = process.env.STORAGE_PATH + FileType.ACCOUNTANCY + 'cert.key';
    private readonly pathAccountancyKey: string = process.env.STORAGE_PATH + FileType.ACCOUNTANCY + 'private.key';

    public saveAccessTokenAccountancy(token: string): void {
        this.ensureDirectoryExistence(this.pathAccountancyAccessToken);
        fs.writeFileSync(this.pathAccountancyAccessToken, token);
    }

    public getAccessTokenAccountancy(): string {
        return fs.readFileSync(this.pathAccountancyAccessToken).toString('utf8');
    }

    public saveRefreshTokenAccountancy(token: string): void {
        this.ensureDirectoryExistence(this.pathAccountancyRefreshToken);
        fs.writeFileSync(this.pathAccountancyRefreshToken, token);
    }

    public getRefreshTokenAccountancy(): string {
        return fs.readFileSync(this.pathAccountancyRefreshToken).toString('utf8');
    }

    public saveResourceIdAccountancy(id: string): void {
        this.ensureDirectoryExistence(this.pathAccountancyResourceId);
        fs.writeFileSync(this.pathAccountancyResourceId, id);
    }

    public getResourceIdAccountancy(): string {
        return fs.readFileSync(this.pathAccountancyResourceId).toString('utf8');
    }

    public getCertificate(): Buffer {
        return fs.readFileSync(this.pathAccountancyCertificate);
    }
  
    public getPrivateKey(): Buffer {
        return fs.readFileSync(this.pathAccountancyKey);
    }

    private ensureDirectoryExistence(filePath: string): void {
        const dirname = path.dirname(filePath);
        if (fs.existsSync(dirname)) {
          return;
        }

        this.ensureDirectoryExistence(dirname);
        fs.mkdirSync(dirname);
    }
}

export enum FileType {
    ACCOUNTANCY = '/accountancy/',
}
