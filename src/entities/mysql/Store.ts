import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('store')
export class Store {
  @PrimaryGeneratedColumn({ type: 'int', name: 'store_id' }) store_id!: number;
  @Column({ type: 'int' }) manager_staff_id!: number;
  @Column({ type: 'int' }) address_id!: number;
  @Column({ type: 'datetime' }) last_update!: Date;
}
