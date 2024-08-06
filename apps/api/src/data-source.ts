import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'local-dev.sql',
  synchronize: true,
  logging: true,
  entities: [],
  subscribers: [],
  migrations: [],
});