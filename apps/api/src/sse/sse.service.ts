import { map, Observable, Subject } from 'rxjs';
import { Injectable } from '@nestjs/common';

export interface ISseService {
  emitEvent(id: string, data: EventData): void;

  getObservable(id: string): Observable<EventData>;
}

export interface EventData {
  data: string;
}

@Injectable()
export class SseService implements ISseService {
  private eventSubject: Subject<EventData> = new Subject<EventData>();

  emitEvent(id: string, data: EventData) {
    this.eventSubject.next(data);
  }

  getObservable(): Observable<EventData> {
    return this.eventSubject.asObservable().pipe(map((data) => data));
  }
}
