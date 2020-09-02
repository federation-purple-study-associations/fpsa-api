import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedAssets1599034741181 implements MigrationInterface {
    name = 'AddedAssets1599034741181'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `accountancy_assets` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `value` int NOT NULL, `comments` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `accountancy_assets`");
    }

}
