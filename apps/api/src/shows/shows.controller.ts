import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ShowsService } from './shows.service';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { QueryFailedError } from 'typeorm';

@Controller('shows')
export class ShowsController {
  constructor(private readonly showsService: ShowsService) {}

  @Post()
  async create(@Body() createShowDto: CreateShowDto) {
    try {
      return await this.showsService.create(createShowDto);
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
    return this.showsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.showsService.findOne(id);
    if (result == null) {
      throw new HttpException('Show not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShowDto: UpdateShowDto) {
    return this.showsService.update(id, updateShowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.showsService.remove(id);
  }
}
