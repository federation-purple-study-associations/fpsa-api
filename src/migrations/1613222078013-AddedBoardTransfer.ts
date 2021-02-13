import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedBoardTransfer1613222078013 implements MigrationInterface {
    name = 'AddedBoardTransfer1613222078013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` ADD `boardTransfer` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `boardTransfer`");
    }

}
