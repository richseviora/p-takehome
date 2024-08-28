import { Controller, Logger, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';

@Controller('sse')
export class SseController {
  private readonly logger = new Logger('SseController');

  constructor(private readonly sseService: SseService) {
    this.logger.warn('SseController');
  }

  @Sse()
  sse(): Observable<any> {
    return this.sseService.getObservable();
  }
}
