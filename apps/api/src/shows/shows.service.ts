import { Inject, Injectable } from '@nestjs/common';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { Repository } from 'typeorm';
import { Show } from '../entities/show';
import { SseService } from '../sse/sse.service';

@Injectable()
export class ShowsService {
  constructor(
    @Inject('SHOW_REPOSITORY') private showRepository: Repository<Show>,
    private sseService: SseService,
  ) {}

  async create(createShowDto: CreateShowDto) {
    const result = await this.showRepository.save(createShowDto);
    this.sseService.emitEvent('bob', { data: JSON.stringify(result) });
    return result;
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
