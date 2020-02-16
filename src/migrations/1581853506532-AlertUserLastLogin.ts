import {MigrationInterface, QueryRunner} from "typeorm";

export class AlertUserLastLogin1581853506532 implements MigrationInterface {
    name = 'AlertUserLastLogin1581853506532'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` ADD `lastLogin` datetime NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `lastLogin`", undefined);
    }

}
