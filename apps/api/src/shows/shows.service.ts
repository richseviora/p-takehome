import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
    this.sseService.emitEvent({
      data: result,
      action: 'add',
      type: 'show',
    });
    return result;
  }

  findAll() {
    return this.showRepository.find();
  }

  findOne(id: string) {
    return this.showRepository.findOneBy({ id });
  }

  async update(id: string, updateShowDto: UpdateShowDto) {
    const result = await this.showRepository.update(id, updateShowDto);
    if (result.affected == null || result.affected === 0) {
      throw new NotFoundException('Show not found');
    }
    return this.showRepository.findOneBy({ id });
  }

  async remove(id: string) {
    const show = await this.showRepository.findOneBy({ id });
    if (show == null) {
      throw new NotFoundException('Show not found');
    }
    await this.showRepository.delete({ id });
  }
}
