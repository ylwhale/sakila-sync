import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('film')
export class Film {
  @PrimaryGeneratedColumn({ type: 'int', name: 'film_id' }) film_id!: number;
  @Column({ type: 'varchar' }) title!: string;
  @Column({ type: 'text', nullable: true }) description!: string | null;
  @Column({ type: 'year', nullable: true }) release_year!: number | null;
  @Column({ type: 'int' }) language_id!: number;
  @Column({ type: 'int', nullable: true }) length!: number | null;
  @Column({ type: 'enum', enum: ['G','PG','PG-13','R','NC-17'], nullable: true }) rating!: any;
  @Column({ type: 'datetime' }) last_update!: Date;
}
