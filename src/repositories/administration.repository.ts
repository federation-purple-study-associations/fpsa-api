import { Injectable } from '@nestjs/common';
import { BaseEntity, IsNull } from 'typeorm';
import { ActivityPlan } from '../entities/administration/activity.plan.entity';
import { AnnualReport } from '../entities/administration/annual.report.entity';
import { BoardGrant } from '../entities/administration/board.grant.entity';
import { User } from '../entities/user/user.entity';

@Injectable()
export class AdministrationRepository {
    public async readAllActivityPlans(user?: User, emptyReport?: boolean, skip?: number, take?: number): Promise<ActivityPlan[]> {
        const where: {user?: User } = {};
        if (user) {
            where.user = user;
        }

        const plans = await ActivityPlan.find({where, skip, take, relations: ['user', 'annualReport'], order: {delivered: 'DESC'}});
        if (typeof emptyReport !== 'undefined') {
            return plans.filter(x => !x.annualReport == emptyReport);
        }
        
        return plans;
    }

    public readOneActivityPlan(id: number): Promise<ActivityPlan> {
        return ActivityPlan.findOne({where: {id}, relations: ['user']});
    }

    public readAllAnnualReports(user?: User, skip?: number, take?: number): Promise<AnnualReport[]> {
        if (!user) {
            return AnnualReport.find({relations: ['activityPlan', 'activityPlan.user'], order: {delivered: 'DESC'}});
        
        } else {
            return AnnualReport.find({where: { activityPlan: { user } }, skip, take, relations: ['activityPlan', 'activityPlan.user'], order: {delivered: 'DESC'}});
        }
    }

    public readOneAnnualReport(id: number): Promise<AnnualReport> {
        return AnnualReport.findOne({where: {id}});
    }

    public readAllBoardGrants(user?: User, skip?: number, take?: number): Promise<BoardGrant[]> {
        if (!user) {
            return BoardGrant.find({relations: ['user'], order: {delivered: 'DESC'}});
        
        } else {
            return BoardGrant.find({where: { user }, skip, take, relations: ['user'], order: {delivered: 'DESC'}});
        }
    }

    public readOneBoardGrant(id: number): Promise<BoardGrant> {
        return BoardGrant.findOne({where: {id}});
    }

    public countAnnualReports(user?: User): Promise<number> {
        if (!user) {
            return AnnualReport.count();
        }

        return AnnualReport.count({where: {activityPlan: {user}}});
    }

    public countBoardGrants(user?: User): Promise<number> {
        if (!user) {
            return BoardGrant.count();
        }

        return BoardGrant.count({where: {user}});
    }

    public async countActivityPlans(user?: User, emptyReport?: boolean): Promise<number> {
        const where: {user?: User } = {};
        if (user) {
            where.user = user;
        }

        const plans = await ActivityPlan.find({where, relations: ['user', 'annualReport']});
        if (typeof emptyReport !== 'undefined') {
            return plans.filter(x => !x.annualReport == emptyReport).length;
        }
        
        return plans.length;
    }

    public save<T extends BaseEntity>(entity: T): Promise<T> {
        return entity.save();
    }

    public delete<T extends BaseEntity>(entity: T): Promise<T> {
        return entity.remove();
    }
}
