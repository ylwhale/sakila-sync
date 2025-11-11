import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('sync_state')
export class SyncState {
  @PrimaryColumn() table_name!: string;
  @Column({ type: 'datetime', nullable: true }) last_marker!: Date | null;
}
