import { Entity, PrimaryColumn } from 'typeorm';
@Entity('bridge_film_category')
export class BridgeFilmCategory {
    @PrimaryColumn({ type: 'integer' }) film_key!: number;
    @PrimaryColumn({ type: 'integer' }) category_key!: number;
}

