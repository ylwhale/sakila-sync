import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('fact_rental')
export class FactRental {
    @PrimaryGeneratedColumn() fact_rental_key!: number;

    @Column({ type: 'integer' }) rental_id!: number;
    @Column({ type: 'integer' }) date_key_rented!: number;

    // 关键：显式 integer + nullable
    @Column({ type: 'integer', nullable: true }) date_key_returned!: number | null;

    @Column({ type: 'integer' }) film_key!: number;
    @Column({ type: 'integer' }) store_key!: number;
    @Column({ type: 'integer' }) customer_key!: number;
    @Column({ type: 'integer' }) staff_id!: number;
    @Column({ type: 'integer' }) rental_duration_days!: number;
}
