import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('language')
export class Language {
  @PrimaryGeneratedColumn({ type: 'int', name: 'language_id' }) language_id!: number;
  @Column({ type: 'varchar' }) name!: string;
  @Column({ type: 'datetime' }) last_update!: Date;
}
