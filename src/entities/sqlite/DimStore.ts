import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('dim_store')
export class DimStore {
  @PrimaryGeneratedColumn() store_key!: number;
  @Column() store_id!: number;
  @Column() city!: string;
  @Column() country!: string;
  @Column({ type: 'datetime' }) last_update!: Date;
}
