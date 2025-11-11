import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn({ type: 'int', name: 'payment_id' }) payment_id!: number;
  @Column({ type: 'int' }) customer_id!: number;
  @Column({ type: 'int' }) staff_id!: number;
  @Column({ type: 'int' }) rental_id!: number;
  @Column({ type: 'decimal', precision: 5, scale: 2 }) amount!: string;
  @Column({ type: 'datetime' }) payment_date!: Date;
  @Column({ type: 'datetime', nullable: true }) last_update!: Date | null;
}
