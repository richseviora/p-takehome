import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  CreateFollowDTO,
  CreateUserDTO,
  UpdateUserDTO,
  UsersService,
} from './users.service';
import { User } from '../entities/user';
import { Follow } from '../entities/follow';
import { QueryFailedError } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDTO): Promise<User> {
    try {
      return await this.usersService.create(createUserDto);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new HttpException(
          'Invalid record error',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      throw e;
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.usersService.findOne(id);
    if (result == null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Post(':id/follows')
  createFollow(
    @Param('id') id: string,
    @Body() createFollowDto: CreateFollowDTO,
  ): Promise<Follow> {
    return this.usersService.createFollow(id, createFollowDto);
  }
}
