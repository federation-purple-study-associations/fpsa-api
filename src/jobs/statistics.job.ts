import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { StatisticRepository } from '../repositories/statistic.repository';
import { PageView } from '../entities/statistic/page.views.entity';

@Injectable()
export class StatisticsJob {
    constructor(
        private readonly statisticRepository: StatisticRepository,
    ) {}

    @Cron('0 0 0 * * *')
    async addEmptyPageView() {
        if (!await this.statisticRepository.getPageViewToday()) {
            const today = new Date();
            today.setHours(0,0,0,0);

            const pageview = new PageView()
            pageview.count = 0;
            pageview.date = today;
            this.statisticRepository.save(pageview);
        }
    }
}