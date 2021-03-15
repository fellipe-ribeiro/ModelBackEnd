import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('orders')
class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  client: string;

  @Column()
  modelName: string;

  @Column()
  type: string;

  @Column('timestamp with time zone')
  entryDate: Date;

  @Column('timestamp with time zone')
  departureDate: Date;

  @Column('int')
  modelingTime: number;

  @Column('int')
  cuttingTime: number;

  @Column('int')
  setupTime: number;

  @Column('int')
  sewingTime: number;

  @Column('int')
  numberOfPieces: number;

  @Column()
  sector: string;

  @Column()
  rawMaterial: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Order;
