import { Command } from "../ddd";

export interface ICommandHandler {
  execute(command: Command): any;
}