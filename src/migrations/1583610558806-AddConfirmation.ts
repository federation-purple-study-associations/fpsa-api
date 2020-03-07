import {MigrationInterface, QueryRunner} from "typeorm";

export class AddConfirmation1583610558806 implements MigrationInterface {
    name = 'AddConfirmation1583610558806'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `confirmation` (`id` int NOT NULL AUTO_INCREMENT, `token` varchar(255) NOT NULL, `userId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `confirmation` ADD CONSTRAINT `FK_74f1ebea7c18510697c0e2a6be4` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `confirmation` DROP FOREIGN KEY `FK_74f1ebea7c18510697c0e2a6be4`", undefined);
        await queryRunner.query("DROP TABLE `confirmation`", undefined);
    }

}
