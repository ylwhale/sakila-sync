import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();

export const sqliteDS = new DataSource({
  type: 'sqlite',
  database: process.env.SQLITE_PATH || './sakila_analytics.sqlite',
  entities: [__dirname + '/../entities/sqlite/*.ts'],
  synchronize: true,
  logging: false,
});
