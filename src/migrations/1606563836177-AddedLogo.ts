import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedLogo1606563836177 implements MigrationInterface {
    name = 'AddedLogo1606563836177'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` ADD `photoUrl` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `application` ADD `photoUrl` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `application` DROP COLUMN `photoUrl`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `photoUrl`");
    }

}
