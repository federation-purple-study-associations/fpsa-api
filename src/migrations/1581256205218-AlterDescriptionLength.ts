import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterDescriptionLength1581256205218 implements MigrationInterface {
    name = 'AlterDescriptionLength1581256205218'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `agenda_item` DROP COLUMN `desciptionNL`", undefined);
        await queryRunner.query("ALTER TABLE `agenda_item` ADD `desciptionNL` varchar(16382) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `agenda_item` DROP COLUMN `desciptionEN`", undefined);
        await queryRunner.query("ALTER TABLE `agenda_item` ADD `desciptionEN` varchar(16382) NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `agenda_item` DROP COLUMN `desciptionEN`", undefined);
        await queryRunner.query("ALTER TABLE `agenda_item` ADD `desciptionEN` varchar(255) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `agenda_item` DROP COLUMN `desciptionNL`", undefined);
        await queryRunner.query("ALTER TABLE `agenda_item` ADD `desciptionNL` varchar(255) NOT NULL", undefined);
    }

}
