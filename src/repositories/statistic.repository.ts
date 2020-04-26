import { PageView } from '../entities/statistic/page.views.entity';
import { BaseEntity, MoreThanOrEqual } from 'typeorm';

export class StatisticRepository {
    public getPageViewToday(): Promise<PageView> {
        const date = new Date();
        date.setHours(0, 0, 0, 0);

        return PageView.findOne({where: {date}});
    }

    public getPageViews(): Promise<PageView[]> {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 1);

        return PageView.find({ order: {date: 'ASC'}, where: {date: MoreThanOrEqual(date)}});
    }

    public save<T extends BaseEntity>(entity: T): Promise<T> {
        return entity.save();
    }
}
