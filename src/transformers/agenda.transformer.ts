import { AgendaItem } from '../entities/agenda/agenda.item.entity';
import { AgendaSummaryDTO } from '../dto/agenda/agenda.summary';
import { AgendaDetailsDTO } from '../dto/agenda/agenda.details';
import { NewAgendaDTO } from '../dto/agenda/agenda.new';
import { extname } from 'path';
import * as uuid from 'uuid/v4';
import { UpdateAgendaDTO } from '../dto/agenda/agenda.update';

export class AgendaTransformer {
    static toSummary(list: AgendaItem[]): AgendaSummaryDTO[] {
        const output: AgendaSummaryDTO[] = [];
        for (const item of list) {
            output.push({
                id: item.id,
                title: item.titleNL || item.titleEN,
                summary: item.summaryNL || item.summaryEN,
                location: item.location,
                date: item.date
            })
        }

        return output;
    }

    static toDetails(item: AgendaItem): AgendaDetailsDTO {
        return {
            id: item.id,
            location: item.location,
            date: item.date,
            title: item.titleNL || item.titleEN,
            description: item.descriptionNL || item.descriptionEN
        };
    }

    static fromNew(body: NewAgendaDTO): AgendaItem {
        const agenda = new AgendaItem();
        agenda.location = body.location;
        agenda.date = body.date;
        agenda.titleNL = body.titleNL;
        agenda.titleEN = body.titleEN;
        agenda.summaryNL = body.summaryNL;
        agenda.summaryEN = body.summaryEN;
        agenda.descriptionNL = body.descriptionNL;
        agenda.descriptionEN = body.descriptionEN;
        agenda.imageUrl = uuid() + extname(body.image.filename);

        return agenda;
    }

    static update(agenda: AgendaItem, body: UpdateAgendaDTO, needUpdateFilePath: boolean) {
        agenda.location = body.location;
        agenda.date = body.date;
        agenda.titleNL = body.titleNL;
        agenda.titleEN = body.titleEN;
        agenda.summaryNL = body.summaryNL;
        agenda.summaryEN = body.summaryEN;
        agenda.descriptionNL = body.descriptionNL;
        agenda.descriptionEN = body.descriptionEN;
        
        if (needUpdateFilePath) {
            agenda.imageUrl = uuid() + extname(body.image.filename);
        }

        return agenda;
    }
}
