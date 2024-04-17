import { Inject, Injectable } from "../di";
import { ILogger } from "../interface/logger.interface";
import { ConfigService } from "./config-service.common";

@Injectable()
export class PegasusLogger implements ILogger {
  private _isDebug: boolean;
  constructor(
    @Inject(ConfigService) protected readonly configService: ConfigService
  ) {
    this._isDebug = this.configService.get<boolean>("debug") || false;
  }
  debug(message: string, ...args: any[]): void {
    if (this._isDebug) {
      console.debug(
        `[ Pegasus ] - [ ${new Date().toISOString()} [ DEBUG [ ${message} ] ] ]`,
        args
      );
    }
  }
  info(message: string, ...args: any[]): void {
    if (this._isDebug) {
      console.info(
        `[ Pegasus ] - [ ${new Date().toISOString()} [ INFO [ ${message} ] ] ]`,
        args
      );
    }
  }
  error(message: string, ...args: any[]): void {
    console.error(
      `[ Pegasus ] - [ ${new Date().toISOString()} [ ERROR [ ${message} ] ] ]`,
      args
    );
  }
}
