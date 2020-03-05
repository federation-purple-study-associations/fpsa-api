import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterRoleAddName1583421453358 implements MigrationInterface {
    name = 'AlterRoleAddName1583421453358'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `role` ADD `name` varchar(255) NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `role` DROP COLUMN `name`", undefined);
    }

}
