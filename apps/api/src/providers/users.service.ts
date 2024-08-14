import { Inject, Injectable } from '@nestjs/common';
import { User } from '../entities/user';
import { Repository } from 'typeorm';
import { Follow } from '../entities/follow';
import { SseService } from '../sse/sse.service';

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
    private sseService: SseService,
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
    this.sseService.emitEvent('bob', { data: JSON.stringify(result) });
    return result;
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    await this.userRepository.update(id, data);
    return this.userRepository.findOneBy({ id });
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });
    await this.userRepository.remove(user);
  }

  async createFollow(
    userId: string,
    followDTO: CreateFollowDTO,
  ): Promise<Follow> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const follow = new Follow();
    follow.user = user;
    // Not a huge fan of this approach but it seems to work, and having to load the show repository just to load
    // the show object so I can persist it seemed a bit silly.
    follow.show = { id: followDTO.show_id } as any;
    const result = await this.followRepository.save(follow);
    this.sseService.emitEvent('bob', { data: JSON.stringify(result) });
    return result;
  }
}
