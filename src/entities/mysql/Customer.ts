import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn({ type: 'int', name: 'customer_id' }) customer_id!: number;
  @Column({ type: 'int' }) store_id!: number;
  @Column({ type: 'varchar' }) first_name!: string;
  @Column({ type: 'varchar' }) last_name!: string;
  @Column({ type: 'int' }) address_id!: number;
  @Column({ type: 'tinyint' }) active!: number;
  @Column({ type: 'datetime' }) create_date!: Date;
  @Column({ type: 'datetime' }) last_update!: Date;
}
