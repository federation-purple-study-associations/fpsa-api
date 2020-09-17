import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateActivityPlanDelivered1600331274039 implements MigrationInterface {
    name = 'UpdateActivityPlanDelivered1600331274039'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_c28e52f758e7bbc53828db92194`");
        await queryRunner.query("ALTER TABLE `activity_plan` ADD `delivered` datetime NOT NULL");
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `FK_c28e52f758e7bbc53828db92194` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_c28e52f758e7bbc53828db92194`");
        await queryRunner.query("ALTER TABLE `activity_plan` DROP COLUMN `delivered`");
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `FK_c28e52f758e7bbc53828db92194` FOREIGN KEY (`roleId`, `roleId`) REFERENCES `role`(`id`,`id`) ON DELETE RESTRICT ON UPDATE RESTRICT");
    }

}
