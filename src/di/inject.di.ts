import 'reflect-metadata';

export const Inject = (dependency: any): ParameterDecorator => {
  return (target: any, propertyKey: string | symbol | undefined, index: number) => {
    const params = Reflect.getMetadata('design:paramtypes', target) || [];
    params[index] = dependency;
    Reflect.defineMetadata('design:paramtypes', params, target);
  };
};