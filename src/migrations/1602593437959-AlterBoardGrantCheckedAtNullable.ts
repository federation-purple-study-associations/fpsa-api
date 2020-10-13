import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterBoardGrantCheckedAtNullable1602593437959 implements MigrationInterface {
    name = 'AlterBoardGrantCheckedAtNullable1602593437959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `board_grant` CHANGE `checkedAt` `checkedAt` datetime NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `board_grant` CHANGE `checkedAt` `checkedAt` datetime NOT NULL");
    }

}
