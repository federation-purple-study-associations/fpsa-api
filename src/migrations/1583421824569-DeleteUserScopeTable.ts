import {MigrationInterface, QueryRunner} from "typeorm";

export class DeleteUserScopeTable1583421824569 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE `user_scopes_scope`;');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `user_scopes_scope` (`userId` int NOT NULL, `scopeId` int NOT NULL, INDEX `IDX_b4f59a6f04730e7578a9986ef3` (`userId`), INDEX `IDX_0c6e66aadf415aae22686aaa99` (`scopeId`), PRIMARY KEY (`userId`, `scopeId`)) ENGINE=InnoDB", undefined);
    }

}
