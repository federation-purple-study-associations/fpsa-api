import {MigrationInterface, QueryRunner} from "typeorm";

export class SeedScopeUserAgenda1581772110226 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        queryRunner.query('INSERT INTO scope(id, scope) VALUES(?, ?)', [1, 'User:Write']);
        queryRunner.query('INSERT INTO scope(id, scope) VALUES(?, ?)', [2, 'User:Delete']);
        queryRunner.query('INSERT INTO scope(id, scope) VALUES(?, ?)', [3, 'Agenda:Write']);
        queryRunner.query('INSERT INTO scope(id, scope) VALUES(?, ?)', [4, 'Agenda:Delete']);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        queryRunner.query('DELETE FROM scope WHERE id <= 4');
    }

}
