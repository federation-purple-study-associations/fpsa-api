import { Injectable } from '@nestjs/common';
import * as sendgridClient from '@sendgrid/mail';
import * as Handlebars from 'handlebars';
import { User } from '../../entities/user/user.entity';
import { Confirmation } from '../../entities/user/confirmation.entity';
import { AgendaItem } from '../../entities/agenda/agenda.item.entity';
import { Application } from '../../entities/user/application.entity';
import * as moment from 'moment';

@Injectable()
export class EmailService {
    private readonly handlebarTemplate: HandlebarsTemplateDelegate;
    private readonly defaultFromEmailAddress = { email: 'info@fpsa.nl', name: 'Federation of Purple Study Associations'};

    constructor() {
        sendgridClient.setApiKey(process.env.SENDGRID_APIKEY);

        // Load all partials for Handlebars
        const partials = {};
        require('fs').readdirSync(__dirname + '/templates').forEach(function(file) {
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
            this.defaultFromEmailAddress,
            user.email,
            'Bevestig uw FPSA account',
            this.handlebarTemplate({
                template: 'email-confirmation',
                user,
                token: confirmation.token,
                baseUrl: process.env.URL_SITE,
            }),
        );
    }

    public async sendEventEmail(agendaItem: AgendaItem, users: User[]): Promise<void> {
        for (const user of users) {
            await this.sendMail(
                this.defaultFromEmailAddress,
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

    public async sendApplicationConfirmation(application: Application): Promise<void> {
        await this.sendMail(
            this.defaultFromEmailAddress,
            application.email,
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
            this.defaultFromEmailAddress,
            application.email,
            'Status aanmelding',
            this.handlebarTemplate({
                template: 'application-decline',
                name: application.name,
                date: moment(application.handedIn).format('DD-MM-YYYY'),
            }),
        );
    }

    public async sendApplicationAccepted(application: Application): Promise<void> {
        await this.sendMail(
            this.defaultFromEmailAddress,
            application.email,
            'Status aanmelding',
            this.handlebarTemplate({
                template: 'application-accept',
                name: application.name,
                date: moment(application.handedIn).format('DD-MM-YYYY'),
            }),
        );
    }

    private sendMail(from: {email: string, name: string}, to: string, subject: string, html: string): Promise<any> {
        return sendgridClient.send({
            to,
            from,
            subject,
            html,
        });
    }
}
