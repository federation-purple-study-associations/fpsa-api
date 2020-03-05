import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRoles1583421118901 implements MigrationInterface {
    name = 'AddRoles1583421118901'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `role` (`id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `role_scopes_scope` (`roleId` int NOT NULL, `scopeId` int NOT NULL, INDEX `IDX_9891f07b0cac0cd80fb0694d31` (`roleId`), INDEX `IDX_e9df80f734de6a00462f6d516b` (`scopeId`), PRIMARY KEY (`roleId`, `scopeId`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `user` ADD `roleId` int NULL", undefined);
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `FK_c28e52f758e7bbc53828db92194` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `role_scopes_scope` ADD CONSTRAINT `FK_9891f07b0cac0cd80fb0694d311` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `role_scopes_scope` ADD CONSTRAINT `FK_e9df80f734de6a00462f6d516b1` FOREIGN KEY (`scopeId`) REFERENCES `scope`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `role_scopes_scope` DROP FOREIGN KEY `FK_e9df80f734de6a00462f6d516b1`", undefined);
        await queryRunner.query("ALTER TABLE `role_scopes_scope` DROP FOREIGN KEY `FK_9891f07b0cac0cd80fb0694d311`", undefined);
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_c28e52f758e7bbc53828db92194`", undefined);
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `roleId`", undefined);
        await queryRunner.query("DROP INDEX `IDX_e9df80f734de6a00462f6d516b` ON `role_scopes_scope`", undefined);
        await queryRunner.query("DROP INDEX `IDX_9891f07b0cac0cd80fb0694d31` ON `role_scopes_scope`", undefined);
        await queryRunner.query("DROP TABLE `role_scopes_scope`", undefined);
        await queryRunner.query("DROP TABLE `role`", undefined);
    }

}
