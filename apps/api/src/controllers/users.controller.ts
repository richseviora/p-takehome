import { Controller, Get, Req, Res, HttpStatus, Param } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from '../providers/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Res() res: Response) {
    res.status(HttpStatus.OK).json([]);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {}
}
