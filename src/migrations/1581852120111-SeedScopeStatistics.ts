import {MigrationInterface, QueryRunner} from "typeorm";

export class SeedScopeStatistics1581852120111 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('INSERT INTO scope(id, scope) VALUES(?, ?)', [5, 'Statistics:Read']);
        await queryRunner.query('INSERT INTO scope(id, scope) VALUES(?, ?)', [6, 'Statistics:Write']);
        await queryRunner.query('INSERT INTO scope(id, scope) VALUES(?, ?)', [7, 'Statistics:Delete']);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DELETE FROM scope WHERE id >= 5 AND id <= 7');
    }

}
