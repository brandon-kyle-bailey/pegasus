import { Command, Query } from "../ddd";

export interface IEventBus {
  execute<T>(event: Command | Query): Promise<T>;
}