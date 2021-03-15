import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateOrders1615652012537 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'client',
            type: 'varchar',
          },
          {
            name: 'modelName',
            type: 'varchar',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'entryDate',
            type: 'timestamp with time zone',
          },
          {
            name: 'departureDate',
            type: 'timestamp with time zone',
          },
          {
            name: 'modelingTime',
            type: 'int',
          },
          {
            name: 'cuttingTime',
            type: 'int',
          },
          {
            name: 'setupTime',
            type: 'int',
          },
          {
            name: 'sewingTime',
            type: 'int',
          },
          {
            name: 'numberOfPieces',
            type: 'int',
          },
          {
            name: 'sector',
            type: 'varchar',
          },
          {
            name: 'rawMaterial',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orders');
  }
}
