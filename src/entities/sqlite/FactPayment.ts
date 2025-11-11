import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('fact_payment')
export class FactPayment {
    @PrimaryGeneratedColumn() fact_payment_key!: number;

    @Column({ type: 'integer' }) payment_id!: number;
    @Column({ type: 'integer' }) date_key_paid!: number;
    @Column({ type: 'integer' }) customer_key!: number;
    @Column({ type: 'integer' }) store_key!: number;
    @Column({ type: 'integer' }) staff_id!: number;

    // 金额用 real/float，显式指定
    @Column({ type: 'real' }) amount!: number;
}
