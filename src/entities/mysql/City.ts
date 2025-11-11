import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('city')
export class City {
  @PrimaryGeneratedColumn({ type: 'int', name: 'city_id' }) city_id!: number;
  @Column({ type: 'varchar' }) city!: string;
  @Column({ type: 'int' }) country_id!: number;
  @Column({ type: 'datetime' }) last_update!: Date;
}
