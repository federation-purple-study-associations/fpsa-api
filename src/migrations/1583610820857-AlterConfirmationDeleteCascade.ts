import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterConfirmationDeleteCascade1583610820857 implements MigrationInterface {
    name = 'AlterConfirmationDeleteCascade1583610820857'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `confirmation` DROP FOREIGN KEY `FK_74f1ebea7c18510697c0e2a6be4`", undefined);
        await queryRunner.query("ALTER TABLE `confirmation` ADD CONSTRAINT `FK_74f1ebea7c18510697c0e2a6be4` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `confirmation` DROP FOREIGN KEY `FK_74f1ebea7c18510697c0e2a6be4`", undefined);
        await queryRunner.query("ALTER TABLE `confirmation` ADD CONSTRAINT `FK_74f1ebea7c18510697c0e2a6be4` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

}
