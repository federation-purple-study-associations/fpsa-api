import { extname } from 'path';
import { CreateActivityPlan } from '../dto/administration/create.activity.plan';
import { ActivityPlan } from '../entities/administration/activity.plan.entity';
import { User } from '../entities/user/user.entity';
import { v4 as uuid } from 'uuid';
import { CreateAnnualReport } from '../dto/administration/create.annual.report';
import { AnnualReport } from '../entities/administration/annual.report.entity';
import { BoardGrant } from '../entities/administration/board.grant.entity';
import { CreateBoardGrant } from '../dto/administration/create.board.grant';

export class AdministrationTransformer {
    public static toActivityPlan(body: CreateActivityPlan, user: User): ActivityPlan {
        const activityPlan = new ActivityPlan();
        activityPlan.delivered = new Date();
        activityPlan.start = body.start;
        activityPlan.end = body.end;
        activityPlan.user = user;
        activityPlan.documentUrl = uuid() + extname(body.document[0].filename);

        return activityPlan;
    }

    public static updateActivityPlan(activityPlan: ActivityPlan, body: CreateActivityPlan, documentUrl: string): void {
        activityPlan.start = body.start;
        activityPlan.end = body.end;
        activityPlan.documentUrl = documentUrl;
    }

    public static toAnnualReport(body: CreateAnnualReport, user: User): AnnualReport {
        const annualReport = new AnnualReport();
        annualReport.delivered = new Date();
        annualReport.user = user;
        annualReport.documentUrl = uuid() + extname(body.document[0].filename);

        return annualReport;
    }

    public static updateAnnualReport(annualReport: AnnualReport, documentUrl: string): void {
        annualReport.documentUrl = documentUrl;
    }

    public static toBoardGrant(body: CreateBoardGrant, user: User): BoardGrant {
        const boardGrant = new BoardGrant();
        boardGrant.delivered = new Date();
        boardGrant.user = user;
        boardGrant.remarks = body.remarks;
        boardGrant.documentUrl = uuid() + extname(body.document[0].filename);

        return boardGrant;
    }

    public static updateBoardGrant(boardGrant: BoardGrant, documentUrl: string, remarks?: string): void {
        boardGrant.documentUrl = documentUrl;
        boardGrant.remarks = remarks;
    }

    public static boardGrantChecked(boardGrant: BoardGrant): void {
        boardGrant.checked = true;
        boardGrant.checkedAt = new Date();
    }
}
