import { Injectable } from '@nestjs/common';
import { BaseEntity, IsNull } from 'typeorm';
import { ActivityPlan } from '../entities/administration/activity.plan.entity';
import { AnnualReport } from '../entities/administration/annual.report.entity';
import { BoardGrant } from '../entities/administration/board.grant.entity';
import { User } from '../entities/user/user.entity';

@Injectable()
export class AdministrationRepository {
    public async readAllActivityPlans(user?: User, skip?: number, take?: number, hasBeenSendToCommission?: boolean): Promise<ActivityPlan[]> {
        const where: {user?: User, sendToCommission?: any } = {};
        if (user) {
            where.user = user;
        }
        if (hasBeenSendToCommission) {
            where.sendToCommission = IsNull();
        }

        return ActivityPlan.find({where, skip, take, relations: ['user'], order: {delivered: 'DESC'}});
    }

    public readOneActivityPlan(id: number): Promise<ActivityPlan> {
        return ActivityPlan.findOne({where: {id}, relations: ['user']});
    }

    public readAllAnnualReports(user?: User, skip?: number, take?: number, hasBeenSendToCommission?: boolean): Promise<AnnualReport[]> {
        const where: {user?: User, sendToCommission?: any } = {};
        if (user) {
            where.user = user;
        }
        if (hasBeenSendToCommission) {
            where.sendToCommission = IsNull();
        }

        return AnnualReport.find({where, skip, take, relations: ['user'], order: {delivered: 'DESC'}});
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
        return BoardGrant.findOne({where: {id}, relations: ['user']});
    }

    public countAnnualReports(user?: User): Promise<number> {
        if (!user) {
            return AnnualReport.count();
        }

        return AnnualReport.count({where: {user}});
    }

    public countBoardGrants(user?: User): Promise<number> {
        if (!user) {
            return BoardGrant.count();
        }

        return BoardGrant.count({where: {user}});
    }

    public countActivityPlans(user?: User): Promise<number> {
        const where: {user?: User } = {};
        if (user) {
            where.user = user;
        }

        return ActivityPlan.count({where, relations: ['user']});
    }

    public save<T extends BaseEntity>(entity: T): Promise<T> {
        return entity.save();
    }

    public delete<T extends BaseEntity>(entity: T): Promise<T> {
        return entity.remove();
    }
}
