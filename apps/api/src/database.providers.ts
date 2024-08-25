import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'sqlite',
        database:
          process.env.NODE_ENV === 'test'
            ? // Inserting the process ID prevents DB contention between different tests.
              `local-test-${process.pid}.sql`
            : 'local-dev.sql',
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
