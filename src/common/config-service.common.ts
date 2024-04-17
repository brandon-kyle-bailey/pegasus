import { Injectable } from "../di";
import { IConfigService } from "../interface";

@Injectable()
export class ConfigService implements IConfigService {
  private readonly config: Record<string, any>;

  constructor(options: Record<string, any> = {}) {
    this.config = { ...options };
  }
  getOrThrow<T>(key: string): T {
    const value = this.get<T>(key);
    if (!value) {
      throw new Error(`${key} does not exist in environment`);
    }
    return value;
  }
  set<T>(key: string, value: T): void {
    this.config[key] = value;
  }

  get<T>(key: string): T {
    return this.config[key] as T;
  }

  env(): Record<string, any> {
    return this.config;
  }
}
