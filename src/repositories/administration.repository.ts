import { Injectable } from '@nestjs/common';
import { BaseEntity } from 'typeorm';
import { ActivityPlan } from '../entities/administration/activity.plan.entity';
import { AnnualReport } from '../entities/administration/annual.report.entity';
import { User } from '../entities/user/user.entity';

@Injectable()
export class AdministrationRepository {
    public readAllActivityPlans(user?: User, skip?: number, take?: number): Promise<ActivityPlan[]> {
        if (!user) {
            return ActivityPlan.find({relations: ['user'], order: {delivered: 'DESC'}});
        
        } else {
            return ActivityPlan.find({where: {user}, skip, take, relations: ['user'], order: {delivered: 'DESC'}});
        }
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

    public save<T extends BaseEntity>(entity: T): Promise<T> {
        return entity.save();
    }

    public delete<T extends BaseEntity>(entity: T): Promise<T> {
        return entity.remove();
    }
}
