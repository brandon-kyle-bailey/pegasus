import EventEmitter from 'events';
import { Injectable } from '../di/injectable.di';


@Injectable()
export class CustomEventEmitter {
  private static instance: EventEmitter;
  private constructor() {}

  static getInstance(): EventEmitter {
    if (!CustomEventEmitter.instance) {
      CustomEventEmitter.instance = new EventEmitter();
    }
    return CustomEventEmitter.instance;
  }
}