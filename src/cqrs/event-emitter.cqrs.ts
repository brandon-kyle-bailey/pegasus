import EventEmitter from 'events';
import { Injectable } from '../di/injectable.di';
import { v4 } from 'uuid';


@Injectable()
export class CustomEventEmitter {
  private static instance: EventEmitter;
  static instanceId: string;
  private constructor() {}

  static getInstance(): EventEmitter {
    if (!CustomEventEmitter.instance) {
      CustomEventEmitter.instance = new EventEmitter();
      CustomEventEmitter.instanceId = v4();
    }
    return CustomEventEmitter.instance;
  }
}