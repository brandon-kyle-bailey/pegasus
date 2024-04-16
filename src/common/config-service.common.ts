import { Injectable } from "../di";
import { IConfigService } from "../interface";

@Injectable()
export class ConfigServie implements IConfigService {
  private _env: { [key: string]: any } = {};
  constructor(initConfig: { [key: string]: any }) {
    this._env = initConfig;
  }
  get<T>(key: string): T {
    return this._env[key];
  }
  getOrThrow<T>(key: string): T {
    const val = this._env[key];
    if (val) {
      throw new Error(`${key} does not exist`);
    }
    return val;
  }
  set<T>(key: string, value: T): void {
    this._env[key] = value;
  }
}
