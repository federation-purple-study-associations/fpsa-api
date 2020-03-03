import {MigrationInterface, QueryRunner} from "typeorm";

export class FixBoardTextLength1583264699466 implements MigrationInterface {
    name = 'FixBoardTextLength1583264699466'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `board` DROP COLUMN `textEN`", undefined);
        await queryRunner.query("ALTER TABLE `board` ADD `textEN` mediumtext NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `board` DROP COLUMN `textNL`", undefined);
        await queryRunner.query("ALTER TABLE `board` ADD `textNL` mediumtext NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `board` DROP COLUMN `textNL`", undefined);
        await queryRunner.query("ALTER TABLE `board` ADD `textNL` varchar(255) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `board` DROP COLUMN `textEN`", undefined);
        await queryRunner.query("ALTER TABLE `board` ADD `textEN` varchar(255) NOT NULL", undefined);
    }

}
