import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('category')
export class Category {
  @PrimaryGeneratedColumn({ type: 'int', name: 'category_id' }) category_id!: number;
  @Column({ type: 'varchar' }) name!: string;
  @Column({ type: 'datetime' }) last_update!: Date;
}
