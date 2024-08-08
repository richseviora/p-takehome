import { Inject, Injectable } from '@nestjs/common';
import { User } from '../entities/user';
import { Repository } from 'typeorm';
import { Follow } from '../entities/follow';

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
    return this.userRepository.save(userData);
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
    follow.show = { id: followDTO.show_id } as any;
    return this.followRepository.save(follow);
  }
}
