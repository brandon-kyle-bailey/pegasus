import { Command } from '../ddd/command.base';

export interface ICommandHandler {
  execute(command: Command): any;
}