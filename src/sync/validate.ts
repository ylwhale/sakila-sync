import { DataSource } from 'typeorm';
import dayjs from 'dayjs';
import { Payment } from '../entities/mysql/Payment';
import { Rental } from '../entities/mysql/Rental';

export async function validate(mysqlDS: DataSource, sqliteDS: DataSource) {
  await mysqlDS.initialize();
  await sqliteDS.initialize();
  const since = dayjs().subtract(30, 'day').toDate();

  const [mysqlPayments, mysqlRentals] = await Promise.all([
    mysqlDS.getRepository(Payment).createQueryBuilder('p')
      .where('p.payment_date >= :since', { since }).getCount(),
    mysqlDS.getRepository(Rental).createQueryBuilder('r')
      .where('r.rental_date >= :since', { since }).getCount()
  ]);

  const dk = Number(dayjs(since).format('YYYYMMDD'));
  const [sqlitePayments, sqliteRentals] = await Promise.all([
    sqliteDS.getRepository('fact_payment').createQueryBuilder('f')
      .where('f.date_key_paid >= :dk', { dk }).getCount(),
    sqliteDS.getRepository('fact_rental').createQueryBuilder('f')
      .where('f.date_key_rented >= :dk', { dk }).getCount()
  ]);

  const msg = [
    `Payments last 30d — MySQL: ${mysqlPayments} vs SQLite: ${sqlitePayments}`,
    `Rentals  last 30d — MySQL: ${mysqlRentals} vs SQLite: ${sqliteRentals}`
  ].join('\n');

  const ok = Math.abs(mysqlPayments - sqlitePayments) < 3 && Math.abs(mysqlRentals - sqliteRentals) < 3;
  return (ok ? 'VALID ✅\n' : 'WARNING ⚠️\n') + msg;
}
