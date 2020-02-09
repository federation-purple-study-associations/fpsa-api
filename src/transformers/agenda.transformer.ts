import { AgendaItem } from '../entities/agenda.item.entity';
import { AgendaSummaryDTO } from '../dto/agenda/agenda.summary';
import { AgendaDetailsDTO } from '../dto/agenda/agenda.details';

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
            description: item.desciptionNL || item.desciptionEN
        };
    }
}
