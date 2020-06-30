import { Injectable } from '@nestjs/common';
import { LANGUAGE } from '../constants';
import { Board } from '../entities/board/board.entity';
import { BaseEntity } from 'typeorm';

@Injectable()
export class BoardRepository {
    public getAll(language: LANGUAGE, skip: number, take: number): Promise<Board[]> {
        const select: any[] = ['id', 'policyPlanUrl'];
        if(language === 'nl') {
            select.push('titleNL', 'textNL');
    
        } else {
            select.push('titleEN', 'textEN');
        }

        return Board.find({select, skip, take, order: {id: 'DESC'} });
    }

    public getOne(id: number, language: LANGUAGE): Promise<Board> {
        const select: any[] = ['id', 'photoUrl', 'policyPlanUrl'];
        if(language === 'nl') {
            select.push('titleNL', 'textNL');
    
        } else {
            select.push('titleEN', 'textEN');
        }

        return Board.findOne({select, where: { id } });
    }

    public getOneFull(id: number): Promise<Board> {
        return Board.findOne({where: { id } });
    }

    public save<T extends BaseEntity>(entity: T): Promise<T> {
        return entity.save();
    }

    public delete<T extends BaseEntity>(entity: T): Promise<T> {
        return entity.remove();
    }
}