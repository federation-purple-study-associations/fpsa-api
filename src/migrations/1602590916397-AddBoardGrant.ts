import {MigrationInterface, QueryRunner} from "typeorm";

export class AddBoardGrant1602590916397 implements MigrationInterface {
    name = 'AddBoardGrant1602590916397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_c28e52f758e7bbc53828db92194`");
        await queryRunner.query("CREATE TABLE `board_grant` (`id` int NOT NULL AUTO_INCREMENT, `delivered` datetime NOT NULL, `documentUrl` varchar(255) NOT NULL, `userId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `board_grant` DROP FOREIGN KEY `FK_7e50e1f0b4111424e4b08837ce5`");
        await queryRunner.query("DROP TABLE `board_grant`");
    }

}
