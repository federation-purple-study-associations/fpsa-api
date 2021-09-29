import { MigrationInterface, QueryRunner } from 'typeorm';

export class HideAdministrationFix1632941037901 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DELETE FROM role_scopes_scope WHERE scopeId = 14 AND roleId = 2',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'INSERT INTO role_scopes_scope(roleId, scopeId) VALUES(?, ?)',
      [2, 14],
    );
  }
}
