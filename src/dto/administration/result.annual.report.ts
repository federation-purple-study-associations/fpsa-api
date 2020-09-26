import { ApiProperty } from '@nestjs/swagger';
import { AnnualReport } from '../../entities/administration/annual.report.entity';

export class ResultAnnualReport {
    @ApiProperty()
    public count: number;

    @ApiProperty({type: () => AnnualReport, isArray: true})
    public annualReports: AnnualReport[];
}
