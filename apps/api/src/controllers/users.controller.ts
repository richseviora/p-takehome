import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Param,
  Post,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDTO, UsersService } from '../providers/users.service';
import { User } from '../entities/user';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Res() res: Response) {
    res.status(HttpStatus.OK).json(this.usersService.findAll());
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDTO): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}
