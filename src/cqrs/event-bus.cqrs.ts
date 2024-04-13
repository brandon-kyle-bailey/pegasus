import { Command, Query } from '../ddd';
import { Inject } from '../di/inject.di';
import { Injectable } from '../di/injectable.di';
import { IEventBus } from '../interface';
import { CustomEventEmitter } from './event-emitter.cqrs';


@Injectable()
export class EventBus implements IEventBus {
  private _eventNames: string[] = [];
  constructor(
    @Inject(CustomEventEmitter)
    protected readonly eventEmitter: CustomEventEmitter
  ) {}

  private _cleanupListeners(): void {
    this._eventNames.map((name) =>
      CustomEventEmitter.getInstance().removeListener(name, console.log)
    );
  }

  async execute<T>(event: Command | Query): Promise<T> {
    const eventName = event.constructor.name;
    const eventCompletedName = `${eventName}ApplicationService-${eventName}-complete`;
    this._eventNames = [eventName, eventCompletedName];
    return await new Promise((resolve) => {
      CustomEventEmitter.getInstance().once(eventCompletedName, (result: any) => {
        this._cleanupListeners();
        resolve(result);
      });
      CustomEventEmitter.getInstance().emit(eventName, event);
    });
  }
}