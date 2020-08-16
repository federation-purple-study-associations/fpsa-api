import { AgendaItem } from '../entities/agenda/agenda.item.entity';
import { AgendaSummaryDTO } from '../dto/agenda/agenda.summary';
import { AgendaDetailsDTO } from '../dto/agenda/agenda.details';
import { NewAgendaDTO } from '../dto/agenda/agenda.new';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { UpdateAgendaDTO } from '../dto/agenda/agenda.update';

export class AgendaTransformer {
    public static toSummary(list: AgendaItem[]): AgendaSummaryDTO[] {
        const output: AgendaSummaryDTO[] = [];
        for (const item of list) {
            output.push({
                id: item.id,
                title: item.titleNL || item.titleEN,
                summary: item.summaryNL || item.summaryEN,
                location: item.location,
                date: item.date,
            })
        }

        return output;
    }

    public static toDetails(item: AgendaItem): AgendaDetailsDTO {
        return {
            id: item.id,
            location: item.location,
            date: item.date,
            title: item.titleNL || item.titleEN,
            description: item.descriptionNL || item.descriptionEN,
        };
    }

    public static fromNew(body: NewAgendaDTO): AgendaItem {
        const agenda = new AgendaItem();
        agenda.location = body.location;
        agenda.date = body.date;
        agenda.titleNL = body.titleNL;
        agenda.titleEN = body.titleEN;
        agenda.summaryNL = body.summaryNL;
        agenda.summaryEN = body.summaryEN;
        agenda.descriptionNL = body.descriptionNL;
        agenda.descriptionEN = body.descriptionEN;
        agenda.imageUrl = uuid() + extname(body.image[0].filename);
        agenda.isDraft = body.isDraft === 'true';

        return agenda;
    }

    public static update(agenda: AgendaItem, body: UpdateAgendaDTO, photoUrl: string): AgendaItem {
        agenda.location = body.location;
        agenda.date = body.date;
        agenda.titleNL = body.titleNL;
        agenda.titleEN = body.titleEN;
        agenda.summaryNL = body.summaryNL;
        agenda.summaryEN = body.summaryEN;
        agenda.descriptionNL = body.descriptionNL;
        agenda.descriptionEN = body.descriptionEN;
        agenda.isDraft = body.isDraft === 'true';
        agenda.imageUrl = photoUrl;

        return agenda;
    }
}
