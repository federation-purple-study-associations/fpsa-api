import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterApplicationAddHandedIn1587406758714 implements MigrationInterface {
    name = 'AlterApplicationAddHandedIn1587406758714'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `application` ADD `handedIn` datetime NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `application` DROP COLUMN `handedIn`", undefined);
    }

}
