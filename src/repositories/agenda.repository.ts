import { Injectable } from '@nestjs/common';
import { AgendaItem } from '../entities/agenda/agenda.item.entity';
import { LANGUAGE } from '../constants';
import { MoreThanOrEqual, BaseEntity, LessThanOrEqual } from 'typeorm';

@Injectable()
export class AgendaRepository {
  public count(inPast: boolean): Promise<number> {
    return AgendaItem.count({
      where: {
        date: inPast ? LessThanOrEqual(new Date()) : MoreThanOrEqual(new Date()),
      },
    });
  }

  public getAll(language: LANGUAGE, skip: number, take: number, inPast: boolean): Promise<AgendaItem[]> {
    const select = this.getSelect();
    if(language === 'nl') {
      select.push('titleNL', 'summaryNL');

    } else {
      select.push('titleEN', 'summaryEN');
    }

    return AgendaItem.find({
      select,
      skip,
      take,
      order: {date: inPast ? 'DESC' : 'ASC'},
      where: {date: inPast ? LessThanOrEqual(new Date()) : MoreThanOrEqual(new Date()), isDraft: false},
    });
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

  public getOneFull(id: number): Promise<AgendaItem> {
    return AgendaItem.findOne({where: {id}});
  }

  public save<T extends BaseEntity>(entity: T): Promise<T> {
    return entity.save();
  }

  public delete<T extends BaseEntity>(entity: T): Promise<T> {
    return entity.remove();
  }

  private getSelect(): any[] {
    return ['id', 'location', 'date'];
  }
}
