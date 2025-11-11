import { DataSource } from 'typeorm';
import { Film } from '../entities/mysql/Film';
import { Language } from '../entities/mysql/Language';
import { Actor } from '../entities/mysql/Actor';
import { Category } from '../entities/mysql/Category';
import { FilmActor } from '../entities/mysql/FilmActor';
import { FilmCategory } from '../entities/mysql/FilmCategory';
import { Inventory } from '../entities/mysql/Inventory';
import { Rental } from '../entities/mysql/Rental';
import { Payment } from '../entities/mysql/Payment';
import { Customer } from '../entities/mysql/Customer';
import { Address } from '../entities/mysql/Address';
import { City } from '../entities/mysql/City';
import { Country } from '../entities/mysql/Country';
import { Store } from '../entities/mysql/Store';

import { DimFilm } from '../entities/sqlite/DimFilm';
import { DimActor } from '../entities/sqlite/DimActor';
import { DimCategory } from '../entities/sqlite/DimCategory';
import { DimStore } from '../entities/sqlite/DimStore';
import { DimCustomer } from '../entities/sqlite/DimCustomer';
import { BridgeFilmActor } from '../entities/sqlite/BridgeFilmActor';
import { BridgeFilmCategory } from '../entities/sqlite/BridgeFilmCategory';
import { FactRental } from '../entities/sqlite/FactRental';
import { FactPayment } from '../entities/sqlite/FactPayment';
import { bulkInsert, dateKey } from './helpers';


export async function fullLoad(mysqlDS: DataSource, sqliteDS: DataSource) {
    await mysqlDS.initialize();
    await sqliteDS.initialize();

    const languages = await mysqlDS.getRepository(Language).find();
    const langById = new Map(languages.map(l => [l.language_id, l.name]));

    const countries = await mysqlDS.getRepository(Country).find();
    const countriesById = new Map(countries.map(c => [c.country_id, c.country]));
    const cities = await mysqlDS.getRepository(City).find();
    const cityById = new Map(cities.map(c => [c.city_id, c.city]));
    const addresses = await mysqlDS.getRepository(Address).find();

    const films = await mysqlDS.getRepository(Film).find();
    const dimFilmRepo = sqliteDS.getRepository(DimFilm);
    await dimFilmRepo.clear();
    await bulkInsert(
        sqliteDS,
        DimFilm,
        films.map(f => ({
            film_id: f.film_id,
            title: f.title,
            rating: (f.rating as any) ?? null,
            length: f.length ?? null,
            language: langById.get(f.language_id) ?? null,
            release_year: f.release_year ?? null,
            last_update: f.last_update
        })),
        500
    );


    const [actors, categories] = await Promise.all([
        mysqlDS.getRepository(Actor).find(),
        mysqlDS.getRepository(Category).find()
    ]);
    await sqliteDS.getRepository(DimActor).clear();
    await sqliteDS.getRepository(DimActor).save(actors.map(a => ({
        actor_id: a.actor_id, first_name: a.first_name, last_name: a.last_name, last_update: a.last_update
    })));
    await sqliteDS.getRepository(DimCategory).clear();
    await sqliteDS.getRepository(DimCategory).save(categories.map(c => ({
        category_id: c.category_id, name: c.name, last_update: c.last_update
    })));

    const stores = await mysqlDS.getRepository(Store).find();
    const storeById = new Map<number, {city:string,country:string,last_update:Date}>();
    for (const s of stores) {
        const addr = addresses.find(a => a.address_id === s.address_id)!;
        const city = cityById.get(addr.city_id)!;
        const country = countriesById.get(cities.find(c => c.city_id === addr.city_id)!.country_id)!;
        storeById.set(s.store_id, { city, country, last_update: s.last_update });
    }

    await sqliteDS.getRepository(DimStore).clear();
    await bulkInsert(
        sqliteDS,
        DimStore,
        [...storeById.entries()].map(([store_id, v]) => ({
            store_id, city: v.city, country: v.country, last_update: v.last_update
        })),
        500
    );
    const customers = await mysqlDS.getRepository(Customer).find();
    await sqliteDS.getRepository(DimCustomer).clear();
    await sqliteDS.getRepository(DimCustomer).save(customers.map(c => {
        const addr = addresses.find(a => a.address_id === c.address_id)!;
        const city = cityById.get(addr.city_id)!;
        const country = countriesById.get(cities.find(x => x.city_id === addr.city_id)!.country_id)!;
        return {
            customer_id: c.customer_id,
            first_name: c.first_name,
            last_name: c.last_name,
            active: c.active,
            city, country,
            last_update: c.last_update
        };
    }));

    const [fa, fc] = await Promise.all([
        mysqlDS.getRepository(FilmActor).find(),
        mysqlDS.getRepository(FilmCategory).find()
    ]);
    const filmKeyByFilmId = new Map<number, number>();
    for (const d of await sqliteDS.getRepository(DimFilm).find()) filmKeyByFilmId.set(d.film_id, d.film_key);
    const actorKeyByActorId = new Map<number, number>();
    for (const d of await sqliteDS.getRepository(DimActor).find()) actorKeyByActorId.set(d.actor_id, d.actor_key);
    const catKeyByCatId = new Map<number, number>();
    for (const d of await sqliteDS.getRepository(DimCategory).find()) catKeyByCatId.set(d.category_id, d.category_key);


    await sqliteDS.getRepository(BridgeFilmActor).clear();
    await bulkInsert(
        sqliteDS,
        BridgeFilmActor,
        fa.map(x => ({
            film_key: filmKeyByFilmId.get(x.film_id)!,
            actor_key: actorKeyByActorId.get(x.actor_id)!
        })),
        500,
        true
    );

    await sqliteDS.getRepository(BridgeFilmCategory).clear();
    await bulkInsert(
        sqliteDS,
        BridgeFilmCategory,
        fc.map(x => ({
            film_key: filmKeyByFilmId.get(x.film_id)!,
            category_key: catKeyByCatId.get(x.category_id)!
        })),
        500,
        true
    );
    const [inventory, rentals, payments] = await Promise.all([
        mysqlDS.getRepository(Inventory).find(),
        mysqlDS.getRepository(Rental).find(),
        mysqlDS.getRepository(Payment).find()
    ]);
    const invById = new Map(inventory.map(i => [i.inventory_id, i]));
    const storeKeyById = new Map<number, number>();
    for (const d of await sqliteDS.getRepository(DimStore).find()) storeKeyById.set(d.store_id, d.store_key);
    const custKeyById = new Map<number, number>();
    for (const d of await sqliteDS.getRepository(DimCustomer).find()) custKeyById.set(d.customer_id, d.customer_key);

    await sqliteDS.getRepository(FactRental).clear();
    await sqliteDS.getRepository(FactRental).save(rentals.map(r => {
        const inv = invById.get(r.inventory_id)!;
        const film_key = filmKeyByFilmId.get(inv.film_id)!;
        const store_key = storeKeyById.get(inv.store_id)!;
        const customer_key = custKeyById.get(r.customer_id)!;
        const dur = r.return_date ? Math.max(0, Math.round((+r.return_date - +r.rental_date)/(1000*60*60*24))) : 0;
        return {
            rental_id: r.rental_id,
            date_key_rented: dateKey(r.rental_date),
            date_key_returned: r.return_date ? dateKey(r.return_date) : null,
            film_key, store_key, customer_key,
            staff_id: r.staff_id,
            rental_duration_days: dur
        };
    }));


    await sqliteDS.getRepository(FactPayment).clear();
    await bulkInsert(
        sqliteDS,
        FactPayment,
        payments.map(p => ({
            payment_id: p.payment_id,
            date_key_paid: dateKey(p.payment_date),
            customer_key: custKeyById.get(p.customer_id)!,
            store_key: storeKeyById.get(invById.get(p.rental_id)?.store_id ?? 1) || [...storeKeyById.values()][0],
            staff_id: p.staff_id,
            amount: Number(p.amount)
        })),
        500
    );
    return 'Full load completed.';
}
