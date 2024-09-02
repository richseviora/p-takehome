import { map, Observable, Subject } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { getCurrentTraceId } from '../tracing';

export interface ISseService {
  getObservable(): Observable<string>;
}

export interface EventData {
  data: unknown;
  type: 'show' | 'follow' | 'user';
  action: 'add';
  __traceparent?: string;
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
    this.emitEvent(data);
  }

  @OnEvent(['show.created'], {
    suppressErrors: false,
  })
  emitShowEvent(data: EventData) {
    this.logger.debug('emitShowEvent', data);
    this.emitEvent(data);
  }

  @OnEvent(['follow.created'], {
    suppressErrors: false,
  })
  emitFollowEvent(data: EventData) {
    this.logger.debug('emitFollowEvent', data);
    this.emitEvent(data);
  }

  getObservable(): Observable<string> {
    this.logger.debug('getObservable');
    return this.eventSubject.asObservable().pipe(map((data) => data));
  }

  private emitEvent(data: EventData): void {
    data.__traceparent = getCurrentTraceId();
    this.eventSubject.next(JSON.stringify(data));
  }
}

2;
