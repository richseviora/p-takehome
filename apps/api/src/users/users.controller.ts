import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  CreateFollowDTO,
  CreateUserDTO,
  UpdateUserDTO,
  UsersService,
} from './users.service';
import { User } from '../entities/user';
import { Follow } from '../entities/follow';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDTO): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
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
