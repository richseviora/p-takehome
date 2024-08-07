import { Inject, Injectable } from '@nestjs/common';
import { User } from '../entities/user';
import { Repository } from 'typeorm';

export class CreateUserDTO {
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
}
