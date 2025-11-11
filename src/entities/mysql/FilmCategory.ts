import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('film_category')
export class FilmCategory {
  @PrimaryColumn({ type: 'int' }) category_id!: number;
  @PrimaryColumn({ type: 'int' }) film_id!: number;
  @Column({ type: 'datetime' }) last_update!: Date;
}
