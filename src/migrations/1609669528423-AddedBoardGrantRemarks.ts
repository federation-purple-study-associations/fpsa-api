import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedBoardGrantRemarks1609669528423 implements MigrationInterface {
    name = 'AddedBoardGrantRemarks1609669528423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `board_grant` ADD `remarks` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `board_grant` DROP COLUMN `remarks`");
    }

}
