import { map, Observable, Subject } from 'rxjs';
import { Injectable, NotFoundException } from '@nestjs/common';

export interface ISseService {
  emitEvent(id: string, data: EventData): void;

  clearEvent(id: string): void;

  isEventActive(id: string): boolean;

  getObservable(id: string): Observable<EventData>;
}

export interface EventData {
  data: string;
}

@Injectable()
export class SseService implements ISseService {
  private eventSubjects: Map<string, Subject<EventData>> = new Map();

  emitEvent(id: string, data: EventData) {
    let eventSubject = this.eventSubjects.get(id);
    if (!eventSubject) {
      eventSubject = new Subject<EventData>();
      this.eventSubjects.set(id, eventSubject);
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

  getObservable(eventId: string): Observable<EventData> {
    const eventSubject = this.eventSubjects.get(eventId);
    if (!eventSubject) {
      throw new NotFoundException(`Event stream with ID ${eventId} not found`);
    }
    return eventSubject.asObservable().pipe(map((data) => data));
  }
}
