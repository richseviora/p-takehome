import { map, Observable, Subject } from 'rxjs';
import { Injectable } from '@nestjs/common';

export interface ISseService {
  emitEvent(data: EventData): void;

  getObservable(): Observable<string>;
}

export interface EventData {
  data: unknown;
  type: 'show' | 'follow' | 'user';
  action: 'add';
}

@Injectable()
export class SseService implements ISseService {
  private eventSubject: Subject<string> = new Subject<string>();

  emitEvent(data: EventData) {
    this.eventSubject.next(JSON.stringify(data));
  }

  getObservable(): Observable<string> {
    return this.eventSubject.asObservable().pipe(map((data) => data));
  }
}
