import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('dim_film')
export class DimFilm {
    @PrimaryGeneratedColumn() film_key!: number;

    @Column({ type: 'integer' }) film_id!: number;
    @Column({ type: 'varchar' }) title!: string;

    // 关键：显式 type，避免 string|null → Object
    @Column({ type: 'varchar', nullable: true }) rating!: string | null;
    @Column({ type: 'integer', nullable: true }) length!: number | null;
    @Column({ type: 'varchar', nullable: true }) language!: string | null;
    @Column({ type: 'integer', nullable: true }) release_year!: number | null;

    @Column({ type: 'datetime', nullable: true }) last_update!: Date | null;
}
