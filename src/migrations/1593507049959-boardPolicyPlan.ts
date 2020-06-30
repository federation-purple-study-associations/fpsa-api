import {MigrationInterface, QueryRunner} from "typeorm";

export class boardPolicyPlan1593507049959 implements MigrationInterface {
    name = 'boardPolicyPlan1593507049959'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `board` ADD `policyPlanUrl` varchar(255) NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `board` DROP COLUMN `policyPlanUrl`", undefined);
    }

}
