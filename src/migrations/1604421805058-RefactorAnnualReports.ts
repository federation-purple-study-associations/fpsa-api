import {MigrationInterface, QueryRunner} from "typeorm";

export class RefactorAnnualReports1604421805058 implements MigrationInterface {
    name = 'RefactorAnnualReports1604421805058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM `annual_report`");
        await queryRunner.query("ALTER TABLE `annual_report` DROP FOREIGN KEY `FK_4412cd0ef286e6c2e672900495d`");
        await queryRunner.query("DROP INDEX `REL_4412cd0ef286e6c2e672900495` ON `annual_report`");
        await queryRunner.query("ALTER TABLE `annual_report` CHANGE `activityPlanId` `userId` int NULL");
        await queryRunner.query("ALTER TABLE `annual_report` ADD CONSTRAINT `FK_622146eda2c787e0e0eef9db874` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `annual_report` DROP FOREIGN KEY `FK_622146eda2c787e0e0eef9db874`");
        await queryRunner.query("ALTER TABLE `annual_report` CHANGE `userId` `activityPlanId` int NULL");
        await queryRunner.query("CREATE UNIQUE INDEX `REL_4412cd0ef286e6c2e672900495` ON `annual_report` (`activityPlanId`)");
        await queryRunner.query("ALTER TABLE `annual_report` ADD CONSTRAINT `FK_4412cd0ef286e6c2e672900495d` FOREIGN KEY (`activityPlanId`) REFERENCES `activity_plan`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
