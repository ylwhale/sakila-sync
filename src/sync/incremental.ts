import { DataSource, MoreThan } from 'typeorm';
import { getMarker, setMarker, dateKey } from './helpers';
import { Film } from '../entities/mysql/Film';
import { Language } from '../entities/mysql/Language';
import { DimFilm } from '../entities/sqlite/DimFilm';
import { Actor } from '../entities/mysql/Actor';
import { Category } from '../entities/mysql/Category';
import { DimActor } from '../entities/sqlite/DimActor';
import { DimCategory } from '../entities/sqlite/DimCategory';
import { Customer } from '../entities/mysql/Customer';
import { Address } from '../entities/mysql/Address';
import { City } from '../entities/mysql/City';
import { Country } from '../entities/mysql/Country';
import { DimCustomer } from '../entities/sqlite/DimCustomer';
import { Rental } from '../entities/mysql/Rental';
import { Payment } from '../entities/mysql/Payment';
import { Inventory } from '../entities/mysql/Inventory';
import { Store } from '../entities/mysql/Store';
import { DimStore } from '../entities/sqlite/DimStore';
import { FactRental } from '../entities/sqlite/FactRental';
import { FactPayment } from '../entities/sqlite/FactPayment';

export async function incremental(mysqlDS: DataSource, sqliteDS: DataSource) {
  await mysqlDS.initialize();
  await sqliteDS.initialize();

  // Film
  {
    const marker = await getMarker(sqliteDS, 'film');
    const cond = marker ? { last_update: MoreThan(marker) } : {};
    const rows = await mysqlDS.getRepository(Film).find({ where: cond as any });
    const lang = await mysqlDS.getRepository(Language).find();
    const langById = new Map(lang.map(l => [l.language_id, l.name]));
    const repo = sqliteDS.getRepository(DimFilm);
    for (const r of rows) {
      const existed = await repo.findOne({ where: { film_id: r.film_id } });
      const payload = {
        film_id: r.film_id,
        title: r.title,
        rating: (r.rating as any) ?? null,
        length: r.length ?? null,
        language: langById.get(r.language_id) ?? null,
        release_year: r.release_year ?? null,
        last_update: r.last_update
      };
      await repo.save(existed ? { ...existed, ...payload } : payload);
    }
    if (rows.length) await setMarker(sqliteDS, 'film', new Date());
  }

  // Actor / Category
  for (const tuple of [['actor', Actor, DimActor], ['category', Category, DimCategory]] as const) {
    const [name, Src, Dst] = tuple;
    const marker = await getMarker(sqliteDS, name);
    const cond = marker ? { last_update: MoreThan(marker) } : {};
    const rows = await mysqlDS.getRepository(Src).find({ where: cond as any });
    const repo = sqliteDS.getRepository(Dst as any);
    for (const r of rows as any[]) {
      const keyField = name === 'actor' ? 'actor_id' : 'category_id';
      const existed = await repo.findOne({ where: { [keyField]: r[keyField] } });
      await repo.save(existed ? { ...existed, ...r } : r);
    }
    if (rows.length) await setMarker(sqliteDS, name, new Date());
  }

  // Customer / Store
  {
    const [customers, addresses, cities, countries, stores] = await Promise.all([
      mysqlDS.getRepository(Customer).find(),
      mysqlDS.getRepository(Address).find(),
      mysqlDS.getRepository(City).find(),
      mysqlDS.getRepository(Country).find(),
      mysqlDS.getRepository(Store).find(),
    ]);
    const cityById = new Map(cities.map(c => [c.city_id, c.city]));
    const countryByCity = new Map(cities.map(c => [c.city_id, countries.find(k => k.country_id === c.country_id)!.country]));
    const dimCust = sqliteDS.getRepository(DimCustomer);
    for (const c of customers) {
      const addr = addresses.find(a => a.address_id === c.address_id)!;
      const existed = await dimCust.findOne({ where: { customer_id: c.customer_id } });
      const payload = {
        customer_id: c.customer_id,
        first_name: c.first_name,
        last_name: c.last_name,
        active: c.active,
        city: cityById.get(addr.city_id)!,
        country: countryByCity.get(addr.city_id)!,
        last_update: c.last_update
      };
      await dimCust.save(existed ? { ...existed, ...payload } : payload);
    }
    const dimStore = sqliteDS.getRepository(DimStore);
    for (const s of stores) {
      const addr = addresses.find(a => a.address_id === s.address_id)!;
      const payload = {
        store_id: s.store_id,
        city: cityById.get(addr.city_id)!,
        country: countryByCity.get(addr.city_id)!,
        last_update: s.last_update
      };
      const existed = await dimStore.findOne({ where: { store_id: s.store_id } });
      await dimStore.save(existed ? { ...existed, ...payload } : payload);
    }
  }

  // Rental
  {
    const marker = await getMarker(sqliteDS, 'rental');
    const cond = marker ? { last_update: MoreThan(marker) } : {};
    const [rentals, inventory, dimFilm, dimStore, dimCust] = await Promise.all([
      mysqlDS.getRepository(Rental).find({ where: cond as any }),
      mysqlDS.getRepository(Inventory).find(),
      sqliteDS.getRepository('dim_film').find(),
      sqliteDS.getRepository('dim_store').find(),
      sqliteDS.getRepository('dim_customer').find()
    ]);
    const invById = new Map(inventory.map(i => [i.inventory_id, i]));
    const filmKeyByFilmId = new Map(dimFilm.map((d: any) => [d.film_id, d.film_key]));
    const storeKeyById = new Map(dimStore.map((d: any) => [d.store_id, d.store_key]));
    const custKeyById = new Map(dimCust.map((d: any) => [d.customer_id, d.customer_key]));
    const repo = sqliteDS.getRepository(FactRental);
    for (const r of rentals) {
      const inv = invById.get(r.inventory_id)!;
      const payload = {
        rental_id: r.rental_id,
        date_key_rented: dateKey(r.rental_date),
        date_key_returned: r.return_date ? dateKey(r.return_date) : null,
        film_key: filmKeyByFilmId.get(inv.film_id)!,
        store_key: storeKeyById.get(inv.store_id)!,
        customer_key: custKeyById.get(r.customer_id)!,
        staff_id: r.staff_id,
        rental_duration_days: r.return_date ? Math.max(0, Math.round((+r.return_date - +r.rental_date)/(1000*60*60*24))) : 0
      };
      const existed = await repo.findOne({ where: { rental_id: r.rental_id } });
      await repo.save(existed ? { ...existed, ...payload } : payload);
    }
    if (rentals.length) await setMarker(sqliteDS, 'rental', new Date());
  }

  // Payment
  {
    const marker = await getMarker(sqliteDS, 'payment');
    const cond = marker ? { payment_date: MoreThan(marker) } : {};
    const payments = await mysqlDS.getRepository(Payment).find({ where: cond as any });
    const dimStore = await sqliteDS.getRepository('dim_store').find();
    const storeKeyById = new Map(dimStore.map((d: any) => [d.store_id, d.store_key]));
    const dimCust = await sqliteDS.getRepository('dim_customer').find();
    const custKeyById = new Map(dimCust.map((d: any) => [d.customer_id, d.customer_key]));
    const repo = sqliteDS.getRepository(FactPayment);
    for (const p of payments) {
      const payload = {
        payment_id: p.payment_id,
        date_key_paid: dateKey(p.payment_date),
        customer_key: custKeyById.get(p.customer_id)!,
        store_key: storeKeyById.get(1) ?? [...storeKeyById.values()][0],
        staff_id: p.staff_id,
        amount: Number(p.amount)
      };
      const existed = await repo.findOne({ where: { payment_id: p.payment_id } });
      await repo.save(existed ? { ...existed, ...payload } : payload);
    }
    if (payments.length) await setMarker(sqliteDS, 'payment', new Date());
  }

  return 'Incremental sync completed.';
}
