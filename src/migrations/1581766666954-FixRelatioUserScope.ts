import {MigrationInterface, QueryRunner} from "typeorm";

export class FixRelatioUserScope1581766666954 implements MigrationInterface {
    name = 'FixRelatioUserScope1581766666954'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `user_scopes_scope` (`userId` int NOT NULL, `scopeId` int NOT NULL, INDEX `IDX_b4f59a6f04730e7578a9986ef3` (`userId`), INDEX `IDX_0c6e66aadf415aae22686aaa99` (`scopeId`), PRIMARY KEY (`userId`, `scopeId`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `user_scopes_scope` ADD CONSTRAINT `FK_b4f59a6f04730e7578a9986ef31` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `user_scopes_scope` ADD CONSTRAINT `FK_0c6e66aadf415aae22686aaa997` FOREIGN KEY (`scopeId`) REFERENCES `scope`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user_scopes_scope` DROP FOREIGN KEY `FK_0c6e66aadf415aae22686aaa997`", undefined);
        await queryRunner.query("ALTER TABLE `user_scopes_scope` DROP FOREIGN KEY `FK_b4f59a6f04730e7578a9986ef31`", undefined);
        await queryRunner.query("DROP INDEX `IDX_0c6e66aadf415aae22686aaa99` ON `user_scopes_scope`", undefined);
        await queryRunner.query("DROP INDEX `IDX_b4f59a6f04730e7578a9986ef3` ON `user_scopes_scope`", undefined);
        await queryRunner.query("DROP TABLE `user_scopes_scope`", undefined);
    }

}
