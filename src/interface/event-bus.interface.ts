import { Command } from "../ddd/command.base";
import { Query } from "../ddd/query.base";

export interface IEventBus {
  execute<T>(event: Command | Query): Promise<T>;
}