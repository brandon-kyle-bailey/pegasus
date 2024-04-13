import { CustomEventEmitter } from "../cqrs/event-emitter.cqrs";
import { IQueryHandler } from "../interface/query-handler.interface";

export function QueryHandler(query: any) {
  return function <T extends { new (...args: any[]): IQueryHandler }>(
    constructor: T
  ) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);
        const instance = CustomEventEmitter.getInstance();
        const originalExecute = this.execute.bind(this);
        this.execute = function (params: any) {
          return originalExecute(params);
        };
        const queryName = query.name;
        const completedEventName = `${constructor.name}-${queryName}-complete`;
        instance.once(queryName, async (payload: any) => {
          const result = await this.execute(payload);
          instance.emit(completedEventName, result);
        });
      }
    };
  };
}