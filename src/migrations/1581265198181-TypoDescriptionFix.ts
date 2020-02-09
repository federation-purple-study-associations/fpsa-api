import {MigrationInterface, QueryRunner} from "typeorm";

export class TypoDescriptionFix1581265198181 implements MigrationInterface {
    name = 'TypoDescriptionFix1581265198181'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `agenda_item` DROP COLUMN `desciptionNL`", undefined);
        await queryRunner.query("ALTER TABLE `agenda_item` DROP COLUMN `desciptionEN`", undefined);
        await queryRunner.query("ALTER TABLE `agenda_item` ADD `descriptionNL` varchar(65535) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `agenda_item` ADD `descriptionEN` varchar(65535) NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `agenda_item` DROP COLUMN `descriptionEN`", undefined);
        await queryRunner.query("ALTER TABLE `agenda_item` DROP COLUMN `descriptionNL`", undefined);
        await queryRunner.query("ALTER TABLE `agenda_item` ADD `desciptionEN` mediumtext NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `agenda_item` ADD `desciptionNL` mediumtext NOT NULL", undefined);
    }

}
