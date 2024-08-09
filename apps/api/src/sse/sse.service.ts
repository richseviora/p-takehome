import { map, Observable, Subject } from 'rxjs';
import { Injectable } from '@nestjs/common';

export interface ISseService {
  emitEvent(id: string, data: EventData): void;

  clearEvent(id: string): void;

  isEventActive(id: string): boolean;

  getObservable(id: string): Observable<EventData>;
}

export interface EventData {
  data: string;
}

const realId = 'user';

@Injectable()
export class SseService implements ISseService {
  private eventSubjects: Map<string, Subject<EventData>> = new Map();

  emitEvent(id: string, data: EventData) {
    let eventSubject = this.eventSubjects.get(realId);
    if (!eventSubject) {
      eventSubject = new Subject<EventData>();
      this.eventSubjects.set(realId, eventSubject);
    }
    eventSubject.next(data);
  }

  clearEvent(id: string) {
    const eventSubject = this.eventSubjects.get(id);
    if (eventSubject) {
      eventSubject.complete();
      this.eventSubjects.delete(id);
    }
  }

  isEventActive(id: string) {
    const eventSubject = this.eventSubjects.get(id);
    if (eventSubject) {
      return true;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- temp usage
  getObservable(eventId: string): Observable<EventData> {
    let eventSubject = this.eventSubjects.get(realId);
    if (!eventSubject) {
      eventSubject = new Subject<EventData>();
      this.eventSubjects.set(realId, eventSubject);
    }
    return eventSubject.asObservable().pipe(map((data) => data));
  }
}