import 'reflect-metadata';
import { Command } from 'commander';
import { mysqlDS } from './datasources/mysql';
import { sqliteDS } from './datasources/sqlite';
import { initDB } from './sync/init';
import { fullLoad } from './sync/fullLoad';
import { incremental } from './sync/incremental';
import { validate } from './sync/validate';

const program = new Command();
program.name('sakila-sync').description('ORM-only MySQL -> SQLite sync CLI');

program.command('init').action(async () => {
  try { console.log(await initDB(sqliteDS)); } 
  catch (e) { console.error(e); process.exitCode = 1; }
  finally { await sqliteDS.destroy(); }
});

program.command('full-load').action(async () => {
  try { console.log(await fullLoad(mysqlDS, sqliteDS)); }
  catch (e) { console.error(e); process.exitCode = 1; }
  finally { await mysqlDS.destroy(); await sqliteDS.destroy(); }
});

program.command('incremental').action(async () => {
  try { console.log(await incremental(mysqlDS, sqliteDS)); }
  catch (e) { console.error(e); process.exitCode = 1; }
  finally { await mysqlDS.destroy(); await sqliteDS.destroy(); }
});

program.command('validate').action(async () => {
  try { console.log(await validate(mysqlDS, sqliteDS)); }
  catch (e) { console.error(e); process.exitCode = 1; }
  finally { await mysqlDS.destroy(); await sqliteDS.destroy(); }
});

program.parseAsync();
