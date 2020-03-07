import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterUserPasswordNullable1583520807983 implements MigrationInterface {
    name = 'AlterUserPasswordNullable1583520807983'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` CHANGE `password` `password` varchar(255) NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` CHANGE `password` `password` varchar(255) NOT NULL", undefined);
    }

}
