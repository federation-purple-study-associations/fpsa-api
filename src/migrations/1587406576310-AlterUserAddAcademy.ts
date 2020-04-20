import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterUserAddAcademy1587406576310 implements MigrationInterface {
    name = 'AlterUserAddAcademy1587406576310'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `application` ADD `academy` varchar(255) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `user` ADD `academy` varchar(255) NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `academy`", undefined);
        await queryRunner.query("ALTER TABLE `application` DROP COLUMN `academy`", undefined);
    }

}
