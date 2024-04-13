import { Injectable } from "../src/di";
import { IConfigService } from "../src/interface";

@Injectable()
export class ConfigService implements IConfigService {
  private readonly config: Record<string, any>;

  constructor() {
    this.config = {
      DEBUG: Boolean(process.env.DEBUG) || true,
    };
  }

  get<T>(key: string): T {
    return this.config[key] as T;
  }
  
  set<T>(key: string, value: T): void {
    this.config[key] = value;
  }
}