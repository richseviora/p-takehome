import { DataSource } from 'typeorm';
import { User } from '../entities/user';
import { Follow } from '../entities/follow';

export const usersProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'FOLLOW_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Follow),
    inject: ['DATA_SOURCE'],
  },
];
