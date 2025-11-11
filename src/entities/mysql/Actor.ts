import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('actor')
export class Actor {
  @PrimaryGeneratedColumn({ type: 'int', name: 'actor_id' }) actor_id!: number;
  @Column({ type: 'varchar' }) first_name!: string;
  @Column({ type: 'varchar' }) last_name!: string;
  @Column({ type: 'datetime' }) last_update!: Date;
}
