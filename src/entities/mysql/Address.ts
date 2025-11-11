import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('address')
export class Address {
  @PrimaryGeneratedColumn({ type: 'int', name: 'address_id' }) address_id!: number;
  @Column({ type: 'varchar' }) address!: string;
  @Column({ type: 'varchar', nullable: true }) address2!: string | null;
  @Column({ type: 'varchar' }) district!: string;
  @Column({ type: 'int' }) city_id!: number;
  @Column({ type: 'varchar', nullable: true }) postal_code!: string | null;
  @Column({ type: 'varchar' }) phone!: string;
  @Column({ type: 'datetime' }) last_update!: Date;
}
