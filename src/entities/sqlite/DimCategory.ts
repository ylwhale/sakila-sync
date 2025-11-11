import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('dim_category')
export class DimCategory {
  @PrimaryGeneratedColumn() category_key!: number;
  @Column() category_id!: number;
  @Column() name!: string;
  @Column({ type: 'datetime' }) last_update!: Date;
}
