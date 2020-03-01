import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterBoardLanguage1583077632098 implements MigrationInterface {
    name = 'AlterBoardLanguage1583077632098'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `board` DROP COLUMN `title`", undefined);
        await queryRunner.query("ALTER TABLE `board` DROP COLUMN `text`", undefined);
        await queryRunner.query("ALTER TABLE `board` ADD `titleEN` varchar(255) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `board` ADD `titleNL` varchar(255) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `board` ADD `textEN` varchar(255) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `board` ADD `textNL` varchar(255) NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `board` DROP COLUMN `textNL`", undefined);
        await queryRunner.query("ALTER TABLE `board` DROP COLUMN `textEN`", undefined);
        await queryRunner.query("ALTER TABLE `board` DROP COLUMN `titleNL`", undefined);
        await queryRunner.query("ALTER TABLE `board` DROP COLUMN `titleEN`", undefined);
        await queryRunner.query("ALTER TABLE `board` ADD `text` varchar(255) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `board` ADD `title` varchar(255) NOT NULL", undefined);
    }

}
