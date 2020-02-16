import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedPageViews1581795060759 implements MigrationInterface {
    name = 'AddedPageViews1581795060759'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `page_view` (`id` int NOT NULL AUTO_INCREMENT, `date` datetime NOT NULL, `count` int NOT NULL, UNIQUE INDEX `IDX_f5a3b98c47a0cb7e950188fa94` (`date`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX `IDX_f5a3b98c47a0cb7e950188fa94` ON `page_view`", undefined);
        await queryRunner.query("DROP TABLE `page_view`", undefined);
    }

}
