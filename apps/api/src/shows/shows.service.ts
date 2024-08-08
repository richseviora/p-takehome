import { Inject, Injectable } from '@nestjs/common';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { Repository } from 'typeorm';
import { Show } from '../entities/show';

@Injectable()
export class ShowsService {
  constructor(
    @Inject('SHOW_REPOSITORY') private showRepository: Repository<Show>,
  ) {}

  create(createShowDto: CreateShowDto) {
    return this.showRepository.create(createShowDto);
  }

  findAll() {
    return this.showRepository.find();
  }

  findOne(id: string) {
    return this.showRepository.findOneBy({ id });
  }

  async update(id: string, updateShowDto: UpdateShowDto) {
    await this.showRepository.update(id, updateShowDto);
    return this.showRepository.findOneBy({ id });
  }

  async remove(id: string) {
    return this.showRepository.delete({ id });
  }
}
