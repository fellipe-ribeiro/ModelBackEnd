import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from './User';

@Entity('orders')
class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

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

  @Column('timestamp with time zone')
  modelingTime: Date;

  @Column('timestamp with time zone')
  cuttingTime: Date;

  @Column('timestamp with time zone')
  setupTime: Date;

  @Column('timestamp with time zone')
  sewingTime: Date;

  @Column('timestamp with time zone')
  finishingTime: Date;

  @Column('timestamp with time zone')
  readyDate: Date;

  @Column('timestamp with time zone')
  deliveredDate: Date;

  @Column('int')
  numberOfPieces: number;

  @Column()
  sector: string;

  @Column()
  rawMaterial: string;

  @Column()
  changed: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Order;
