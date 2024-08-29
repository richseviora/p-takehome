import { map, Observable, Subject } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

export interface ISseService {
  getObservable(): Observable<string>;
}

export interface EventData {
  data: unknown;
  type: 'show' | 'follow' | 'user';
  action: 'add';
}

@Injectable()
export class SseService implements ISseService {
  private readonly logger: Logger = new Logger('SseService');
  private eventSubject: Subject<string> = new Subject<string>();

  /**
   * The EventEmitter document claims to support wildcards, but this does
   * not appear to work in practice.
   * @param data
   */
  @OnEvent(['user.created'], {
    suppressErrors: false,
  })
  emitUserEvent(data: EventData) {
    this.logger.debug('emitUserEvent', data);
    this.eventSubject.next(JSON.stringify(data));
  }

  @OnEvent(['show.created'], {
    suppressErrors: false,
  })
  emitShowEvent(data: EventData) {
    this.logger.debug('emitShowEvent', data);
    this.eventSubject.next(JSON.stringify(data));
  }

  @OnEvent(['follow.created'], {
    suppressErrors: false,
  })
  emitFollowEvent(data: EventData) {
    this.logger.debug('emitFollowEvent', data);
    this.eventSubject.next(JSON.stringify(data));
  }

  getObservable(): Observable<string> {
    this.logger.debug('getObservable');
    return this.eventSubject.asObservable().pipe(map((data) => data));
  }
}

2;
