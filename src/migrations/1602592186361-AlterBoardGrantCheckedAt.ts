import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterBoardGrantCheckedAt1602592186361 implements MigrationInterface {
    name = 'AlterBoardGrantCheckedAt1602592186361'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `board_grant` ADD `checkedAt` datetime NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `board_grant` DROP COLUMN `checkedAt`");
    }

}
