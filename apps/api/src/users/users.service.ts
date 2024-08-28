import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from '../entities/user';
import { QueryFailedError, Repository } from 'typeorm';
import { Follow } from '../entities/follow';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class CreateUserDTO {
  name: string;
}

export class UpdateUserDTO {
  name: string;
}

export class CreateFollowDTO {
  user_id: string;
  show_id: string;
}

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    @Inject('FOLLOW_REPOSITORY') private followRepository: Repository<Follow>,
    private eventEmitter: EventEmitter2,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        follows: {
          show: true,
        },
      },
    });
  }

  async create(userData: CreateUserDTO): Promise<User | null> {
    const result = await this.userRepository.save(userData);
    this.eventEmitter.emit('user.created', {
      data: result,
      action: 'add',
      type: 'user',
    });
    console.log('user created', result);
    return result;
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    const result = await this.userRepository.update(id, data);
    if (result.affected == null || result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.findOneBy({ id });
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });
    if (user == null) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.remove(user);
  }

  async createFollow(
    userId: string,
    followDTO: CreateFollowDTO,
  ): Promise<Follow> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user == null) {
      throw new NotFoundException('User not found');
    }
    const follow = new Follow();
    follow.user = user;
    // Not a huge fan of this approach but it seems to work, and having to load the show repository just to load
    // the show object so I can persist it seemed a bit silly.
    follow.show = { id: followDTO.show_id } as any;
    try {
      const result = await this.followRepository.save(follow);
      this.eventEmitter.emit('follow.created', {
        data: result,
        type: 'follow',
        action: 'add',
      });
      console.log('follow created', result);
      return result;
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new UnprocessableEntityException();
      }
      throw e;
    }
  }
}
