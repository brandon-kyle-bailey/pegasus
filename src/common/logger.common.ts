import { Injectable } from "../di";
import { ILogger } from "../interface/logger.interface";

@Injectable()
export class PegasusLogger implements ILogger {
  private _isDebug: boolean;
  constructor(deps?: { debug: boolean }) {
    this._isDebug = deps?.debug || false;
  }
  debug(message: string, ...args: any[]): void {
    if (this._isDebug) {
      console.log(
        `[ Pegasus ] - [ ${new Date().toISOString()} [ DEBUG [ ${message} ] ] ]`,
        args
      );
    }
  }
  info(message: string, ...args: any[]): void {
    if (this._isDebug) {
      console.log(
        `[ Pegasus ] - [ ${new Date().toISOString()} [ INFO [ ${message} ] ] ]`,
        args
      );
    }
  }
  error(message: string, ...args: any[]): void {
    console.log(
      `[ Pegasus ] - [ ${new Date().toISOString()} [ ERROR [ ${message} ] ] ]`,
      args
    );
  }
}
