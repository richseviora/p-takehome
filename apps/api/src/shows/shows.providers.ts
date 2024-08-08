import { DataSource } from 'typeorm';
import { Show } from '../entities/show';

export const showsProviders = [
  {
    provide: 'SHOW_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Show),
    inject: ['DATA_SOURCE'],
  },
];
