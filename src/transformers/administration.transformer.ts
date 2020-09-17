import { extname } from 'path';
import { CreateActivityPlan } from '../dto/administration/create.activity.plan';
import { ActivityPlan } from '../entities/administration/activity.plan.entity';
import { User } from '../entities/user/user.entity';
import { v4 as uuid } from 'uuid';

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
}
