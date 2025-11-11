import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'inventory_id' }) inventory_id!: number;
  @Column({ type: 'int' }) film_id!: number;
  @Column({ type: 'int' }) store_id!: number;
  @Column({ type: 'datetime' }) last_update!: Date;
}
