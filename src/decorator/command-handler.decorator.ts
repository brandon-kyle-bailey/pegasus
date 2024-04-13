import { CustomEventEmitter } from "../cqrs/event-emitter.cqrs";
import { ICommandHandler } from "../interface/command-handler.interface";

export function CommandHandler(command: any) {
  return function <T extends { new (...args: any[]): ICommandHandler }>(
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
        const commandName = command.name;
        const completedEventName = `${constructor.name}-${commandName}-complete`;
        instance.once(commandName, async (payload: any) => {
          const result = await this.execute(payload);
          instance.emit(completedEventName, result);
        });
      }
    };
  };
}