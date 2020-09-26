import {MigrationInterface, QueryRunner} from "typeorm";

export class SeedAdministrationSystem1601106792036 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('INSERT INTO scope(id, scope) VALUES(?, ?)', [17, 'Administration:System']);
        await queryRunner.query('INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)', [1, 17]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM scope WHERE id = 17');
        await queryRunner.query('DELETE FROM role_scopes_scope WHERE scopeId = 17');
    }

}
