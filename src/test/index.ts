import { PegasusLogger } from "../common";
import { ConfigService } from "../common/config-service.common";
import { Command, CommandProps, Query } from "../ddd";
import { Inject, Injectable, Module, PegasusFactory } from "../di";
import { IApplicationService, IController, ModuleMetadata } from "../interface";

class SomeCommand extends Command {
  private constructor(props: CommandProps<SomeCommand>) {
    super(props);
  }

  static create(props: CommandProps<SomeCommand>): SomeCommand {
    return new SomeCommand(props);
  }
}

@Injectable()
class SomeApplicationService implements IApplicationService {
  constructor(
    @Inject(ConfigService) protected readonly configService: ConfigService,
    @Inject(PegasusLogger) protected readonly logger: PegasusLogger
  ) {}
  async execute(payload: Command | Query): Promise<any> {
    try {
      const someValue = this.configService.getOrThrow("hello");
      this.logger.debug("SomeApplicationService.execute called.", someValue);
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}

@Injectable()
class SomeController implements IController {
  constructor(
    @Inject(SomeApplicationService)
    protected readonly service: SomeApplicationService
  ) {}
  async execute(dto: any): Promise<any> {
    await this.service.execute(SomeCommand.create({}));
  }
}

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
class ConfigModule {
  static forRoot(options: Record<string, any>): any {
    @Module({
      providers: [],
      exports: [
        { provide: ConfigService, useValue: new ConfigService(options) },
      ],
    })
    class container {}
    return container;
  }
}

@Module({
  imports: [ConfigModule.forRoot({ debug: true, endpoint: "fsdf" })],
  providers: [PegasusLogger, SomeApplicationService],
  controllers: [SomeController],
  exports: [SomeApplicationService],
})
class AppModule {}

@Module({
  imports: [ConfigModule.forRoot({ debug: true, endpoint: "fsdf" }), AppModule],
  providers: [PegasusLogger],
})
class SubjectModule {}

// const bootstrapOne = async () => {
//   const app = PegasusFactory.create(AppModule, { debug: false });
//   const configService = app.resolve<ConfigService>(ConfigService);
//   configService.set("hello", "there");
//   const contoller = app.resolve<SomeController>(SomeController);
//   await contoller.execute("");
// };

// bootstrapOne();

const bootstrapTwo = async () => {
  const app = PegasusFactory.create(SubjectModule, { debug: true });
  const configService = app.resolve<ConfigService>(ConfigService);
  configService.set("hello", "world");
  const service = app.resolve<SomeApplicationService>(SomeApplicationService);
  await service.execute(SomeCommand.create({}));
};

bootstrapTwo();
