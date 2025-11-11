import { Entity, PrimaryColumn } from 'typeorm';
@Entity('bridge_film_actor')
export class BridgeFilmActor {
    @PrimaryColumn({ type: 'integer' }) film_key!: number;
    @PrimaryColumn({ type: 'integer' }) actor_key!: number;
}
