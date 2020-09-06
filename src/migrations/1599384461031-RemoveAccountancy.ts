import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveAccountancy1599384461031 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `accountancy_mutation` DROP FOREIGN KEY `FK_88d7d7957c98caea89bafd9d04b`", undefined);
        await queryRunner.query("ALTER TABLE `accountancy_mutation` DROP FOREIGN KEY `FK_df784126c7f596daf494ddfaade`", undefined);
        await queryRunner.query("DROP TABLE `accountancy_income_statement`", undefined);
        await queryRunner.query("DROP TABLE `accountancy_mutation`", undefined);
        await queryRunner.query("DROP TABLE `accountancy_payment_method`", undefined);
        await queryRunner.query("DROP TABLE `accountancy_assets`");

        await queryRunner.query('DELETE FROM scope WHERE id >= 14 AND id <= 16');
        await queryRunner.query('DELETE FROM role_scopes_scope WHERE scopeId >= 14 AND scopeId <= 16');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `accountancy_payment_method` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `code` int NOT NULL, `startAssets` int NOT NULL DEFAULT 0, `startLiabilities` int NOT NULL DEFAULT 0, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `accountancy_mutation` (`id` int NOT NULL AUTO_INCREMENT, `entryReference` int NOT NULL, `description` varchar(255) NOT NULL, `date` datetime NOT NULL, `amount` int NOT NULL, `debtorIban` varchar(255) NOT NULL, `imported` tinyint NOT NULL DEFAULT 0, `paymentMethodId` int NULL, `incomeStatementId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `accountancy_income_statement` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `code` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `accountancy_assets` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `value` int NOT NULL, `comments` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `accountancy_mutation` ADD CONSTRAINT `FK_df784126c7f596daf494ddfaade` FOREIGN KEY (`paymentMethodId`) REFERENCES `accountancy_payment_method`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `accountancy_mutation` ADD CONSTRAINT `FK_88d7d7957c98caea89bafd9d04b` FOREIGN KEY (`incomeStatementId`) REFERENCES `accountancy_income_statement`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
    
        await queryRunner.query('INSERT INTO scope(id, scope) VALUES(?, ?)', [14, 'Accountancy:Read']);
        await queryRunner.query('INSERT INTO scope(id, scope) VALUES(?, ?)', [15, 'Accountancy:Write']);
        await queryRunner.query('INSERT INTO scope(id, scope) VALUES(?, ?)', [16, 'Accountancy:Delete']);
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [1, 14]);
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [1, 15]);
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [1, 16]);
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [2, 14]);
    }

}
