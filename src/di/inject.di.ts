import "reflect-metadata";
import { ReflectMetadataEnum } from "../enum/reflect-metadata.enum";

export const Inject = (dependency: any): ParameterDecorator => {
  return (
    target: any,
    propertyKey: string | symbol | undefined,
    index: number
  ) => {
    const params =
      Reflect.getMetadata(ReflectMetadataEnum.DESIGN_PARAMTYPES, target) || [];
    params[index] = dependency;
    Reflect.defineMetadata(
      ReflectMetadataEnum.DESIGN_PARAMTYPES,
      params,
      target
    );
  };
};
