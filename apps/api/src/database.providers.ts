import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'sqlite',
        database: 'local-dev.sql',
        synchronize: true,
        logging: true,
        entities: [__dirname + '/**/entities/*{.ts,.js}'],
        subscribers: [],
        migrations: [],
      });

      return dataSource.initialize();
    },
  },
];
