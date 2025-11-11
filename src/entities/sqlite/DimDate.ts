import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('dim_date')
export class DimDate {
  @PrimaryColumn() date_key!: number;
  @Column({ type: 'date' }) date!: string;
  @Column() year!: number;
  @Column() quarter!: number;
  @Column() month!: number;
  @Column({ name: 'day_of_month' }) day_of_month!: number;
  @Column({ name: 'day_of_week' }) day_of_week!: number;
  @Column({ name: 'is_weekend' }) is_weekend!: number;
}
