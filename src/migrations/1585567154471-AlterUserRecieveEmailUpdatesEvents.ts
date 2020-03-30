import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterUserRecieveEmailUpdatesEvents1585567154471 implements MigrationInterface {
    name = 'AlterUserRecieveEmailUpdatesEvents1585567154471'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` ADD `recieveEmailUpdatesEvents` tinyint NOT NULL DEFAULT 0", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `recieveEmailUpdatesEvents`", undefined);
    }

}
