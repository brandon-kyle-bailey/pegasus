import { PegasusLogger } from "../common/logger.common";
import { ReflectMetadataEnum } from "../enum/reflect-metadata.enum";
import { ModuleMetadata } from "../interface";
import { Container } from "./container.di";

export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata(
      ReflectMetadataEnum.MODULE_METADATA,
      metadata,
      target
    );
  };
}

export interface ModuleConfig {
  debug?: boolean;
}

export class PegasusFactory {
  static create(T: any, config?: ModuleConfig): Container {
    const logger = new PegasusLogger({ debug: config?.debug ?? false });
    const start = new Date().getTime();
    logger.info(`[ ${T.name} ] Loading Dependencies...`);
    const container = new Container([T], logger);
    const end = new Date().getTime();
    logger.info(`[ ${T.name} ] Dependencies loaded...`, `${end - start}ms`);
    return container;
  }

  static createTestingModule(T: any, config?: ModuleConfig): Container {
    const metadata: ModuleMetadata = {
      imports: [],
      providers: [],
      controllers: [],
      exports: [],
      ...T,
    };
    return PegasusFactory.create([metadata]);
  }
}
