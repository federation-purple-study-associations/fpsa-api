import {MigrationInterface, QueryRunner} from "typeorm";

export class SeedProfileringsfondRole1601489789863 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('INSERT INTO role(id, name) VALUES(?, ?)', [3, 'Fontys']);
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [3, 11]);
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [3, 14]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM role_scopes_scope WHERE roleId = 3');
        await queryRunner.query('DELETE FROM role WHERE id = 3');
    }

}
