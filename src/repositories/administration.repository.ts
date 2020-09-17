import { Injectable } from '@nestjs/common';
import { BaseEntity } from 'typeorm';
import { ActivityPlan } from '../entities/administration/activity.plan.entity';
import { User } from '../entities/user/user.entity';

@Injectable()
export class AdministrationRepository {
    public readAllActivityPlans(user?: User, skip?: number, take?: number): Promise<ActivityPlan[]> {
        if (!user) {
            return ActivityPlan.find();
        
        } else {
            return ActivityPlan.find({where: {user}, skip, take});
        }
    }

    public readOneActivityPlan(id: number): Promise<ActivityPlan> {
        return ActivityPlan.findOne({where: {id}, relations: ['user']});
    }

    public save<T extends BaseEntity>(entity: T): Promise<T> {
        return entity.save();
    }
}