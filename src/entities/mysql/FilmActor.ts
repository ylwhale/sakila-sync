import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('film_actor')
export class FilmActor {
  @PrimaryColumn({ type: 'int' }) actor_id!: number;
  @PrimaryColumn({ type: 'int' }) film_id!: number;
  @Column({ type: 'datetime' }) last_update!: Date;
}
