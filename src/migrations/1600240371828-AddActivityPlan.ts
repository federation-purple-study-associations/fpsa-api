import {MigrationInterface, QueryRunner} from "typeorm";

export class AddActivityPlan1600240371828 implements MigrationInterface {
    name = 'AddActivityPlan1600240371828'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_c28e52f758e7bbc53828db92194`");
        await queryRunner.query("CREATE TABLE `activity_plan` (`id` int NOT NULL AUTO_INCREMENT, `start` datetime NOT NULL, `end` datetime NOT NULL, `documentUrl` varchar(255) NOT NULL, `userId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `FK_c28e52f758e7bbc53828db92194` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `activity_plan` ADD CONSTRAINT `FK_c678212847b190145be14aa77f2` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `activity_plan` DROP FOREIGN KEY `FK_c678212847b190145be14aa77f2`");
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_c28e52f758e7bbc53828db92194`");
        await queryRunner.query("DROP TABLE `activity_plan`");
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `FK_c28e52f758e7bbc53828db92194` FOREIGN KEY (`roleId`, `roleId`) REFERENCES `role`(`id`,`id`) ON DELETE RESTRICT ON UPDATE RESTRICT");
    }

}
