import { TestController } from "./test.controller";
import { TestQueryApplicationService } from "./test.service";
import { CustomEventEmitter, QueryBus } from "../src/cqrs";
import { Module } from "../src/di";
import { ConfigService } from "./test-config.service";
import { TestAdapter } from "./test.adapter";
import { TestPort } from "./test.port";

@Module({
  imports: [CustomEventEmitter],
  providers: [
    ConfigService,
    QueryBus,
    TestAdapter,
    TestPort,
    TestQueryApplicationService
  ],
  controllers: [TestController],
})
export default class AppModule {}