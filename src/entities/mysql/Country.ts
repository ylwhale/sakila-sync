import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('country')
export class Country {
  @PrimaryGeneratedColumn({ type: 'int', name: 'country_id' }) country_id!: number;
  @Column({ type: 'varchar' }) country!: string;
  @Column({ type: 'datetime' }) last_update!: Date;
}
