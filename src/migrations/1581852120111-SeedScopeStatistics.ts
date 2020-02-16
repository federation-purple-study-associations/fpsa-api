import {MigrationInterface, QueryRunner} from "typeorm";

export class SeedScopeStatistics1581852120111 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        queryRunner.query('INSERT INTO scope(id, scope) VALUES(?, ?)', [5, 'Statistics:Read']);
        queryRunner.query('INSERT INTO scope(id, scope) VALUES(?, ?)', [6, 'Statistics:Write']);
        queryRunner.query('INSERT INTO scope(id, scope) VALUES(?, ?)', [7, 'Statistics:Delete']);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        queryRunner.query('DELETE FROM scope WHERE id >= 5 AND id <= 7');
    }

}
