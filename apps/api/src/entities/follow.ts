import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user';
import { Show } from './show';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Show, { onDelete: 'CASCADE' })
  show: Show;

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
