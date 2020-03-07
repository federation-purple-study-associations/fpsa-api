import {MigrationInterface, QueryRunner} from "typeorm";

export class SeedScopeUser1583518971155 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('INSERT INTO scope(id, scope) VALUES(?, ?)', [11, 'User:Read']);
        await queryRunner.query('INSERT INTO scope(id, scope) VALUES(?, ?)', [12, 'User:Write']);
        await queryRunner.query('INSERT INTO scope(id, scope) VALUES(?, ?)', [13, 'User:Delete']);
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [1, 11]);
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [1, 12]);
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [1, 13]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DELETE FROM scope WHERE id >= 11 AND id <= 13');
        await queryRunner.query('DELETE FROM role_scopes_scope WHERE scopeId >= 11 AND scopeId <= 13');
    }

}
