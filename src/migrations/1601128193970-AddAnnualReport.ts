import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAnnualReport1601128193970 implements MigrationInterface {
    name = 'AddAnnualReport1601128193970'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `annual_report` (`id` int NOT NULL AUTO_INCREMENT, `delivered` datetime NOT NULL, `documentUrl` varchar(255) NOT NULL, `activityPlanId` int NULL, UNIQUE INDEX `REL_4412cd0ef286e6c2e672900495` (`activityPlanId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `annual_report` ADD CONSTRAINT `FK_4412cd0ef286e6c2e672900495d` FOREIGN KEY (`activityPlanId`) REFERENCES `activity_plan`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `annual_report` DROP FOREIGN KEY `FK_4412cd0ef286e6c2e672900495d`");
        await queryRunner.query("DROP INDEX `REL_4412cd0ef286e6c2e672900495` ON `annual_report`");
        await queryRunner.query("DROP TABLE `annual_report`");
    }
}
