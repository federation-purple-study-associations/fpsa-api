import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserAndScope1581766153002 implements MigrationInterface {
    name = 'AddUserAndScope1581766153002'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `fullName` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `scope` (`id` int NOT NULL AUTO_INCREMENT, `scope` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `scope`", undefined);
        await queryRunner.query("DROP TABLE `user`", undefined);
    }

}
