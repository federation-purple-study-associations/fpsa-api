import { Injectable } from '@nestjs/common';
import { AgendaItem } from '../entities/agenda.item.entity';
import { LANGUAGE } from '../constants';

@Injectable()
export class AgendaRepository {
  public getAll(language: LANGUAGE, skip: number, take: number): Promise<AgendaItem[]> {
    const select = this.getSelect();
    if(language === 'nl') {
      select.push('titleNL', 'summaryNL');

    } else {
      select.push('titleEN', 'summaryEN');
    }

    return AgendaItem.find({select, skip, take, order: {date: 'ASC'}});
  }

  public getOne(id: number, language: LANGUAGE): Promise<AgendaItem> {
    const select = this.getSelect();
    if(language === 'nl') {
      select.push('titleNL', 'descriptionNL', 'imageUrl');

    } else {
      select.push('titleEN', 'descriptionEN');
    }

    return AgendaItem.findOne({where: {id}, select});
  }

  private getSelect(): any[] {
    return ['id', 'location', 'date'];
  }
}
