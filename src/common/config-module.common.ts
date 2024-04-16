import { Module } from "../di";
import { ConfigService } from "./config-service.common";
import { PegasusLogger } from "./logger.common";

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {
  static forRoot(options: Record<string, any>): any {
    @Module({
      providers: [],
      exports: [
        { provide: ConfigService, useValue: new ConfigService(options) },
        { provide: PegasusLogger, useClass: PegasusLogger },
      ],
    })
    class container {}
    return container;
  }
}
