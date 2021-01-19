import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateAgenda1611045705322 implements MigrationInterface {
    name = 'UpdateAgenda1611045705322'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `agenda_item` DROP COLUMN `summaryNL`");
        await queryRunner.query("ALTER TABLE `agenda_item` DROP COLUMN `summaryEN`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `agenda_item` ADD `summaryEN` varchar(255) COLLATE \"utf8mb4_unicode_ci\" NOT NULL");
        await queryRunner.query("ALTER TABLE `agenda_item` ADD `summaryNL` varchar(255) COLLATE \"utf8mb4_unicode_ci\" NOT NULL");
    }

}
