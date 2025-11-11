import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('rental')
export class Rental {
  @PrimaryGeneratedColumn({ type: 'int', name: 'rental_id' }) rental_id!: number;
  @Column({ type: 'datetime' }) rental_date!: Date;
  @Column({ type: 'int' }) inventory_id!: number;
  @Column({ type: 'int' }) customer_id!: number;
  @Column({ type: 'datetime', nullable: true }) return_date!: Date | null;
  @Column({ type: 'int' }) staff_id!: number;
  @Column({ type: 'datetime' }) last_update!: Date;
}
