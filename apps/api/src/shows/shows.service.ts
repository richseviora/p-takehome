import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { Show } from '../entities/show';

@Injectable()
export class ShowsService {
  constructor(
    @Inject('SHOW_REPOSITORY') private showRepository: Repository<Show>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createShowDto: CreateShowDto) {
    const result = await this.showRepository.save(createShowDto);
    const emitResult = this.eventEmitter.emit('show.created', {
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
