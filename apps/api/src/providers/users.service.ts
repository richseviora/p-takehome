import { Inject, Injectable } from '@nestjs/common';
import { User } from '../entities/user';
import { Repository } from 'typeorm';

export class CreateUserDTO {
  name: string;
}

export class UpdateUserDTO {
  name: string;
}

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
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
}
