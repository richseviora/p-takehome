import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Follow } from './follow';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  name: string;

  @OneToMany(() => Follow, (follow) => follow.user)
  follows: Promise<Follow[]>;

  @CreateDateColumn({
    type: 'text',
    default: () => `strftime('%Y-%m-%dT%H:%M:%S', julianday())`,
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'text',
    default: () => `strftime('%Y-%m-%dT%H:%M:%S', julianday())`,
    onUpdate: `strftime('%Y-%m-%dT%H:%M:%S', julianday())`,
  })
  updated_at: Date;
}
