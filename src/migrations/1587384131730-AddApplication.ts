import {MigrationInterface, QueryRunner} from "typeorm";

export class AddApplication1587384131730 implements MigrationInterface {
    name = 'AddApplication1587384131730'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `application` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `application`", undefined);
    }

}
