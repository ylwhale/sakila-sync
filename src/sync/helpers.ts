import dayjs from 'dayjs';
import { DataSource } from 'typeorm';
import { SyncState } from '../entities/sqlite/SyncState';
// 需要这两个类型时再补：
// import { EntityTarget } from 'typeorm/common/EntityTarget';
// import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export const dateKey = (d: Date) => Number(dayjs(d).format('YYYYMMDD'));
export const ymd = (d: Date) => dayjs(d).format('YYYY-MM-DD');

export const dayOfWeek = (d: Date) => {
  const n = dayjs(d).day(); // 0..6, Sunday=0
  return n === 0 ? 7 : n;
};
export const isWeekend = (d: Date) => {
  const dow = dayOfWeek(d);
  return dow === 6 || dow === 7 ? 1 : 0;
};

export async function getMarker(ds: DataSource, table: string) {
  const repo = ds.getRepository(SyncState);
  const row = await repo.findOne({ where: { table_name: table } });
  return row?.last_marker ?? null;
}
export async function setMarker(ds: DataSource, table: string, marker: Date) {
  const repo = ds.getRepository(SyncState);
  await repo.save({ table_name: table, last_marker: marker });
}


export async function bulkInsert<T>(
    ds: DataSource,
    entity: any,                         // EntityTarget<T>
    rows: any[],                         // QueryDeepPartialEntity<T>[]
    chunk = 500,
    orIgnore = false
) {
    for (let i = 0; i < rows.length; i += chunk) {
        const slice = rows.slice(i, i + chunk);
        const qb = ds.createQueryBuilder().insert().into(entity).values(slice as any);
        if (orIgnore) qb.orIgnore();
        await qb.execute();
    }
}

