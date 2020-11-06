import { Injectable } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import { User } from '../../entities/user/user.entity';
import { Confirmation } from '../../entities/user/confirmation.entity';
import { AgendaItem } from '../../entities/agenda/agenda.item.entity';
import { Application } from '../../entities/user/application.entity';
import * as moment from 'moment-timezone';
import { readdirSync, readFile } from 'fs';
import * as nodemailer from 'nodemailer';
import { ContactFormDTO } from '../../dto/user/contact.form';
import { ContactMembersDTO } from '../../dto/user/contact.members';
import { ActivityPlan } from '../../entities/administration/activity.plan.entity';
import { AnnualReport } from 'src/entities/administration/annual.report.entity';
import Mail = require('nodemailer/lib/mailer');
import { resolve } from 'path';

@Injectable()
export class EmailService {
    private readonly handlebarTemplate: HandlebarsTemplateDelegate;
    private readonly defaultFromEmailAddress: string = '"Federation of Purple Study Associations" info@fpsa.nl';
    private readonly mailer: nodemailer.Transporter;

    private readonly activityPlanDocumentUrl: string = resolve(process.env.STORAGE_PATH, 'administration', 'activityPlan');
    private readonly annualReportDocumentUrl: string = resolve(process.env.STORAGE_PATH, 'administration', 'annualReport');

    constructor() {
        this.mailer = nodemailer.createTransport({
            service: "Outlook365",
            auth: {
              user: process.env.SMTP_USERNAME,
              pass: process.env.SMTP_PASSWORD,
            },
          });

        // Load all partials for Handlebars
        const partials = {};
        readdirSync(__dirname + '/templates').forEach((file: string) => {
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
                    apiUrl: process.env.URL_API,
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
                handedIn: moment(application.handedIn).tz("Europe/Amsterdam").format('DD-MM-YYYY HH:mm'),
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

    public async sendContactMembersEmail(form: ContactMembersDTO, members: User[]): Promise<void> {
        for(const member of members) {
            await this.sendMail(
                '"' + member.fullName + '" ' + member.email,
                "Contact: " + form.subject,
                this.handlebarTemplate({
                    template: 'contact-members',
                    message: form.message,
                    name: member.fullName,
                }),
            );
        }

        await this.sendMail(
            this.defaultFromEmailAddress,
            "Kopie contact: "+ form.subject,
            this.handlebarTemplate({
                template: 'contact-members',
                message: form.message,
                name: "{STUDIE VERENIGING}",
            }),
        );
    }

    public async sendActivityPlanReminder(member: User): Promise<void> {
        await this.sendMail(
            '"' + member.fullName + '" ' + member.email,
            "HERINNERING: Nieuw activiteitenplan aanleveren",
            this.handlebarTemplate({
                template: 'activity-plan-reminder',
                name: member.fullName,
            }),
        );
    }

    public async sendActivityPlanConfirmation(member: User, activityPlan: ActivityPlan): Promise<void> {
        await this.sendMail(
            '"' + member.fullName + '" ' + member.email,
            'Activiteitenplan ontvangen!',
            this.handlebarTemplate({
                template: 'activity-plan-confirmation',
                name: member.fullName,
                date: moment(activityPlan.end).tz("Europe/Amsterdam").format('DD-MM-YYYY'),
            }),
        );
    }

    public async sendAnnualReportConfirmation(member: User): Promise<void> {
        await this.sendMail(
            '"' + member.fullName + '" ' + member.email,
            'Jaarverslag ontvangen!',
            this.handlebarTemplate({
                template: 'annual-report-confirmation',
                name: member.fullName,
            }),
        );
    }

    public async sendBoardGrantConfirmation(member: User): Promise<void> {
        const now = new Date();
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);

        if (now.getMonth() < 7) {
            now.setFullYear(now.getFullYear() - 1);
            nextYear.setFullYear(nextYear.getFullYear() - 1);
        }

        await this.sendMail(
            '"' + member.fullName + '" ' + member.email,
            'Aanmelding bestuursbeurs ontvangen!',
            this.handlebarTemplate({
                template: 'board-grant-confirmation',
                name: member.fullName,
                board_grant_period: now.getFullYear() + '-' + nextYear.getFullYear(),
            }),
        );
    }

    public async sendReportsToComission(activityPlans: ActivityPlan[], annualReports: AnnualReport[]): Promise<void> {
        const attachmentActivityPlan: Mail.Attachment[] = await this.buildAttachment(activityPlans, this.activityPlanDocumentUrl, 'activiteitenplan');
        const attachmentAnnualReport: Mail.Attachment[] = await this.buildAttachment(annualReports, this.annualReportDocumentUrl, 'jaarverslag');

        const dataActivitplans = activityPlans
            .sort(this.sortFullName)
            .map(x => {
                return {
                    fullName: x.user.fullName,
                    start: moment(x.start).format('DD-MM-YYYY'),
                    end: moment(x.end).format('DD-MM-YYYY'),
                    delivered: moment(x.delivered).format('DD-MM-YYYY'),
                };
            });

        const dataAnnualReports = annualReports
            .sort(this.sortFullName)
            .map(x => {
                return {
                    fullName: x.user.fullName,
                    delivered: moment(x.delivered).format('DD-MM-YYYY'),
                };
            });

        await this.sendMail(
            '"Commissie Profileringsfonds" profileringsfonds@fontys.nl',
            'Maandelijkse update - activiteitenplan en jaarverslag',
            this.handlebarTemplate({
                template: 'update-commission',
                date: moment().subtract(1, 'days').format('MMMM YYYY'),
                dataActivitplans,
                dataAnnualReports,
                hasActivityPlans: attachmentActivityPlan.length > 0,
                hasAnnualReports: attachmentAnnualReport.length > 0,
            }),
            undefined,
            attachmentActivityPlan.concat(attachmentAnnualReport),
        );
    }

    private sendMail(to: string, subject: string, html: string, replyTo?: string, attachments?: Mail.Attachment[]): Promise<any> {
        return this.mailer.sendMail({
            from: this.defaultFromEmailAddress,
            to,
            subject,
            html,
            replyTo,
            attachments,
        })
    }

    private async buildAttachment(reports: ActivityPlan[] | AnnualReport[], storageUrl: string, suffix: string): Promise<Mail.Attachment[]> {
        const attachments: Mail.Attachment[] = [];

        for (const report of reports) {
            const content = await new Promise<Buffer>((Resolve) => {
                readFile(resolve(storageUrl, report.documentUrl), (err, data) => {
                    if (err) { 
                        Resolve(null);
                    }

                    Resolve(data);
                })
            });

            if (content) {
                attachments.push({
                    filename: `${report.user.fullName} - ${suffix}.pdf`,
                    content,
                });
            }
        }

        return attachments;
    }

    private sortFullName(a, b) {
        if(a.user.fullName < b.user.fullName) { return -1; }
        if(a.user.fullName > b.user.fullName) { return 1; }
        return 0;
    }
}
