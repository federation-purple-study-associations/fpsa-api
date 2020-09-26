import { ApiProperty } from '@nestjs/swagger';
import { ActivityPlan } from '../../entities/administration/activity.plan.entity';

export class ResultActivityPlan {
    @ApiProperty()
    public count: number;

    @ApiProperty({type: () => ActivityPlan, isArray: true})
    public activityPlans: ActivityPlan[];
}
