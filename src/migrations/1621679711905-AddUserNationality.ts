import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserNationality1621679711905 implements MigrationInterface {
    name = 'AddUserNationality1621679711905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` ADD `nationality` int NOT NULL DEFAULT '0'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `nationality`");
    }

}
