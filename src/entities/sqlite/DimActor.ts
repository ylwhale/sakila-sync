import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('dim_actor')
export class DimActor {
  @PrimaryGeneratedColumn() actor_key!: number;
  @Column() actor_id!: number;
  @Column() first_name!: string;
  @Column() last_name!: string;
  @Column({ type: 'datetime' }) last_update!: Date;
}
