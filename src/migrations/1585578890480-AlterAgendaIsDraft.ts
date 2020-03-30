import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterAgendaIsDraft1585578890480 implements MigrationInterface {
    name = 'AlterAgendaIsDraft1585578890480'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `agenda_item` ADD `isDraft` tinyint NOT NULL DEFAULT 0", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `agenda_item` DROP COLUMN `isDraft`", undefined);
    }

}
