import { DocumentBuilder } from '@nestjs/swagger';

const swaggerOptions = new DocumentBuilder()
    .setTitle('FPSA API')
    .setDescription('FPSA API documentation')
    .setContact('FPSA', 'https://www.fpsa.nl', 'info@fpsa.nl')
    // tslint:disable-next-line: no-var-requires
    .setVersion(require('../../package.json').version)
    .build();

export default swaggerOptions;