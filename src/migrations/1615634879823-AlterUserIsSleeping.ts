import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterUserIsSleeping1615634879823 implements MigrationInterface {
    name = 'AlterUserIsSleeping1615634879823'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` ADD `isSleeping` tinyint NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `isSleeping`");
    }

}
