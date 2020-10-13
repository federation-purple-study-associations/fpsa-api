import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterBoardGrantChecked1602591434555 implements MigrationInterface {
    name = 'AlterBoardGrantChecked1602591434555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `board_grant` ADD `checked` tinyint NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `board_grant` DROP COLUMN `checked`");
    }

}
