import {MigrationInterface, QueryRunner} from "typeorm";

export class SeedAccountancyScopes1593886377507 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('INSERT INTO scope(id, scope) VALUES(?, ?)', [14, 'Accountancy:Read']);
        await queryRunner.query('INSERT INTO scope(id, scope) VALUES(?, ?)', [15, 'Accountancy:Write']);
        await queryRunner.query('INSERT INTO scope(id, scope) VALUES(?, ?)', [16, 'Accountancy:Delete']);
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [1, 14]);
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [1, 15]);
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [1, 16]);
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [2, 14]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DELETE FROM scope WHERE id >= 14 AND id <= 16');
        await queryRunner.query('DELETE FROM role_scopes_scope WHERE scopeId >= 14 AND scopeId <= 16');
    }

}
