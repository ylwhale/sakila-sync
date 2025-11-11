import { DataSource } from 'typeorm';
import dayjs from 'dayjs';
import { DimDate } from '../entities/sqlite/DimDate';
import { SyncState } from '../entities/sqlite/SyncState';

export async function initDB(sqliteDS: DataSource) {
  await sqliteDS.initialize();
  const start = dayjs('2005-01-01'), end = dayjs('2006-12-31');
  const repo = sqliteDS.getRepository(DimDate);
  const rows: DimDate[] = [];
  for (let d = start; d.isBefore(end) || d.isSame(end); d = d.add(1, 'day')) {
    const row = new DimDate();
    row.date_key = Number(d.format('YYYYMMDD'));
    row.date = d.format('YYYY-MM-DD');
    row.year = d.year();
    row.quarter = Math.floor((d.month()) / 3) + 1;
    row.month = d.month() + 1;
    row.day_of_month = d.date();
    const dow = d.day();
    row.day_of_week = dow === 0 ? 7 : dow;
    row.is_weekend = (row.day_of_week >= 6) ? 1 : 0;
    rows.push(row);
  }
  await repo.clear();
  await repo.save(rows);
  await sqliteDS.getRepository(SyncState).save({ table_name: 'bootstrap', last_marker: null });
  return 'Initialized analytics DB (dim_date + tables).';
}
