import {MigrationInterface, QueryRunner} from "typeorm";

export class SeedScopeRole1583421958463 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [1, 1]);
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [1, 2]);
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [1, 3]);
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [1, 4]);
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [1, 5]);
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [1, 6]);
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [1, 7]);
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [1, 8]);
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [1, 9]);
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [1, 10]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DELETE FROM role_scopes_scope');
    }

}
