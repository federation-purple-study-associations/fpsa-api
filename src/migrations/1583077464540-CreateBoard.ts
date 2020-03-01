import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateBoard1583077464540 implements MigrationInterface {
    name = 'CreateBoard1583077464540'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `board` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `text` varchar(255) NOT NULL, `photoUrl` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `board`", undefined);
    }

}
