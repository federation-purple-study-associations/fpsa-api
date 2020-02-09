import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateAgenda1581254283389 implements MigrationInterface {
    name = 'CreateAgenda1581254283389'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `agenda_item` (`id` int NOT NULL AUTO_INCREMENT, `location` varchar(255) NOT NULL, `date` datetime NOT NULL, `imageUrl` varchar(255) NOT NULL, `titleNL` varchar(63) NOT NULL, `titleEN` varchar(63) NOT NULL, `summaryNL` varchar(255) NOT NULL, `summaryEN` varchar(255) NOT NULL, `desciptionNL` varchar(255) NOT NULL, `desciptionEN` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `agenda_item`", undefined);
    }

}
