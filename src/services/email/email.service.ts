import { Injectable } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import { User } from '../../entities/user/user.entity';
import { Confirmation } from '../../entities/user/confirmation.entity';
import { AgendaItem } from '../../entities/agenda/agenda.item.entity';
import { Application } from '../../entities/user/application.entity';
import * as moment from 'moment-timezone';
import { readdirSync } from 'fs';
import * as nodemailer from 'nodemailer';
import { ContactFormDTO } from '../../dto/user/contact.form';

@Injectable()
export class EmailService {
    private readonly handlebarTemplate: HandlebarsTemplateDelegate;
    private readonly defaultFromEmailAddress = '"Federation of Purple Study Associations" info@fpsa.nl';
    private readonly mailer: nodemailer.Transporter;

    constructor() {
        this.mailer = nodemailer.createTransport({
            service: "Outlook365",
            auth: {
              user: process.env.SMTP_USERNAME,
              pass: process.env.SMTP_PASSWORD,
            }
          });

        // Load all partials for Handlebars
        const partials = {};
        readdirSync(__dirname + '/templates').forEach(function(file) {
            if (file.match(/\.hbs$/) !== null) {
              const name = file.replace('.hbs', '');
              partials[name] = require('./templates/' + file);
            }
        });

        // Build handlebars delegate
        Handlebars.registerPartial(partials);
        this.handlebarTemplate = Handlebars.compile(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
            </head>
            <body>
                {{> header}}
                {{> (lookup . 'template')}}
                {{> footer}}
            </body>
            </html>`);
    }

    public sendRegistrationConfirmation(user: User, confirmation: Confirmation): Promise<any> {
        return this.sendMail(
            user.email,
            'Bevestig uw FPSA account',
            this.handlebarTemplate({
                template: 'account-confirmation',
                user,
                token: confirmation.token,
                baseUrl: process.env.URL_SITE,
            }),
        );
    }

    public sendForgotPasswordEmail(user: User, confirmation: Confirmation): Promise<any> {
        return this.sendMail(
            user.email,
            'Herstel uw FPSA account',
            this.handlebarTemplate({
                template: 'account-recovery',
                user,
                token: confirmation.token,
                baseUrl: process.env.URL_SITE,
            }),
        );
    }

    public async sendEventEmail(agendaItem: AgendaItem, users: User[]): Promise<void> {
        for (const user of users) {
            await this.sendMail(
                user.email,
                'NIEUW EVENEMENT: ' + agendaItem.titleNL,
                this.handlebarTemplate({
                    template: 'new-event',
                    event: agendaItem,
                    user,
                    baseUrl: process.env.URL_SITE,
                }),
            );
        }
    }

    public async sendApplicationToBoard(application: Application): Promise<void> {
        await this.sendMail(
            this.defaultFromEmailAddress,
            'Nieuwe aanmelding ontvangen: ' + application.name,
            this.handlebarTemplate({
                template: 'application-to-board',
                application,
                handedIn: moment(application.handedIn).tz("Europe/Amsterdam").format('DD-MM-YYYY HH:mm')
            }),
            '"' + application.name + '" ' + application.email,
        )
    }

    public async sendApplicationConfirmation(application: Application): Promise<void> {
        await this.sendMail(
            '"' + application.name + '" ' + application.email,
            'Aanmelding ontvangen!',
            this.handlebarTemplate({
                template: 'application-confirmation',
                name: application.name,
                baseUrl: process.env.URL_SITE,
            }),
        );
    }

    public async sendApplicationDeclined(application: Application): Promise<void> {
        await this.sendMail(
            '"' + application.name + '" ' + application.email,
            'Status aanmelding',
            this.handlebarTemplate({
                template: 'application-decline',
                name: application.name,
                date: moment(application.handedIn).tz("Europe/Amsterdam").format('DD-MM-YYYY'),
            }),
        );
    }

    public async sendApplicationAccepted(application: Application): Promise<void> {
        await this.sendMail(
            '"' + application.name + '" ' + application.email,
            'Status aanmelding',
            this.handlebarTemplate({
                template: 'application-accept',
                name: application.name,
                date: moment(application.handedIn).tz("Europe/Amsterdam").format('DD-MM-YYYY'),
            }),
        );
    }

    public async sendContactEmail(form: ContactFormDTO): Promise<void> {
        await this.sendMail(
            this.defaultFromEmailAddress,
            "Contact: " + form.subject,
            this.handlebarTemplate({
                template: 'contact-form',
                message: form.message,
                name: form.name,
            }),
            '"' + form.name + '" ' + form.email,
        );
    }

    private sendMail(to: string, subject: string, html: string, replyTo?: string): Promise<any> {
        return this.mailer.sendMail({
            from: this.defaultFromEmailAddress,
            to,
            subject,
            html,
            replyTo,
        })
    }
}
