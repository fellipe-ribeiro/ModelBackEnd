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
            type: 'timestamp with time zone',
            isNullable: true,
            default: null,
          },
          {
            name: 'cuttingTime',
            type: 'timestamp with time zone',
            isNullable: true,
            default: null,
          },
          {
            name: 'setupTime',
            type: 'timestamp with time zone',
            isNullable: true,
            default: null,
          },
          {
            name: 'sewingTime',
            type: 'timestamp with time zone',
            isNullable: true,
            default: null,
          },
          {
            name: 'finishingTime',
            type: 'timestamp with time zone',
            isNullable: true,
            default: null,
          },
          {
            name: 'readyDate',
            type: 'timestamp with time zone',
            isNullable: true,
            default: null,
          },
          {
            name: 'deliveredDate',
            type: 'timestamp with time zone',
            isNullable: true,
            default: null,
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
            name: 'changed',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
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
