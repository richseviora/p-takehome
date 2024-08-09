import { Controller, Headers, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse()
  sse(@Headers() headers: Headers): Observable<any> {
    const token = headers['authorization'];
    return this.sseService.getObservable(token);
  }
}
