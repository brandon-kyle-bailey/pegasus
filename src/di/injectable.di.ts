import "reflect-metadata";
import { ReflectMetadataEnum } from "../enum";

export function Injectable(): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata(ReflectMetadataEnum.DESIGN_INJECTABLE, true, target);
  };
}
