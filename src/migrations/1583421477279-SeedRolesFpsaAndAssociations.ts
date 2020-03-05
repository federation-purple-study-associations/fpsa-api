import {MigrationInterface, QueryRunner} from "typeorm";

export class SeedRolesFpsaAndAssociations1583421477279 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('INSERT INTO role(id, name) VALUES(?, ?)', [1, 'Fpsa']);
        await queryRunner.query('INSERT INTO role(id, name) VALUES(?, ?)', [2, 'Vereniging']);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DELETE FROM scope WHERE id < 3');
    }

}
