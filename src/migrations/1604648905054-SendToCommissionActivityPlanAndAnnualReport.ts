import {MigrationInterface, QueryRunner} from "typeorm";

export class SendToCommissionActivityPlanAndAnnualReport1604648905054 implements MigrationInterface {
    name = 'SendToCommissionActivityPlanAndAnnualReport1604648905054'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `FK_c28e52f758e7bbc53828db92194` ON `user`");
        await queryRunner.query("ALTER TABLE `annual_report` ADD `sendToCommission` datetime NULL");
        await queryRunner.query("ALTER TABLE `activity_plan` ADD `sendToCommission` datetime NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `activity_plan` DROP COLUMN `sendToCommission`");
        await queryRunner.query("ALTER TABLE `annual_report` DROP COLUMN `sendToCommission`");
        await queryRunner.query("CREATE INDEX `FK_c28e52f758e7bbc53828db92194` ON `user` (`roleId`)");
    }

}
