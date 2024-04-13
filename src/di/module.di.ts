import { ModuleMetadata } from "../interface";
import { Container } from "./container.di";

export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata('module:metadata', metadata, target);
  };
}

export class ModuleFactory {
  static create(T: any): Container {
    return new Container([T]);
  }
}