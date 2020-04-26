import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterUserAddKvKAndEstablishment1587894109636 implements MigrationInterface {
    name = 'AlterUserAddKvKAndEstablishment1587894109636'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `application` ADD `establishment` varchar(255) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `application` ADD `kvk` int NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `user` ADD `establishment` varchar(255) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `user` ADD `kvk` int NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `kvk`", undefined);
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `establishment`", undefined);
        await queryRunner.query("ALTER TABLE `application` DROP COLUMN `kvk`", undefined);
        await queryRunner.query("ALTER TABLE `application` DROP COLUMN `establishment`", undefined);
    }

}
