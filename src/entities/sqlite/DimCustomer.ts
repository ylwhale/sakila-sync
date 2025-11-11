import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('dim_customer')
export class DimCustomer {
  @PrimaryGeneratedColumn() customer_key!: number;
  @Column() customer_id!: number;
  @Column() first_name!: string;
  @Column() last_name!: string;
  @Column() active!: number;
  @Column() city!: string;
  @Column() country!: string;
  @Column({ type: 'datetime' }) last_update!: Date;
}
