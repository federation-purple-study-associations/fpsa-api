import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateRecieveEmailUpdateEvents1601490671457 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('UPDATE user SET recieveEmailUpdatesEvents = 1');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
