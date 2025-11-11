import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn({ type: 'int', name: 'staff_id' }) staff_id!: number;
  @Column({ type: 'int' }) store_id!: number;
  @Column({ type: 'varchar' }) first_name!: string;
  @Column({ type: 'varchar' }) last_name!: string;
  @Column({ type: 'datetime' }) last_update!: Date;
}
