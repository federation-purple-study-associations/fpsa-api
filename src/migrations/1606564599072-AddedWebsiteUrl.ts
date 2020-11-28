import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedWebsiteUrl1606564599072 implements MigrationInterface {
    name = 'AddedWebsiteUrl1606564599072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` ADD `websiteUrl` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `application` ADD `websiteUrl` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `application` DROP COLUMN `websiteUrl`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `websiteUrl`");
    }

}
