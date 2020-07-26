import {MigrationInterface, QueryRunner} from "typeorm";

export class memberSince1595770106732 implements MigrationInterface {
    name = 'memberSince1595770106732'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` ADD `memberSince` datetime NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `memberSince`", undefined);
    }

}
