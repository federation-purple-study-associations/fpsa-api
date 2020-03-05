import {MigrationInterface, QueryRunner} from "typeorm";

export class SeedScopeBoard1583264102489 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('INSERT INTO scope(id, scope) VALUES(?, ?)', [8, 'Board:Read']);
        await queryRunner.query('INSERT INTO scope(id, scope) VALUES(?, ?)', [9, 'Board:Write']);
        await queryRunner.query('INSERT INTO scope(id, scope) VALUES(?, ?)', [10, 'Board:Delete']);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DELETE FROM scope WHERE id >= 8 AND id <= 10');
    }

}
