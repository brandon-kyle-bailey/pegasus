import { ModuleMetadata } from "../interface";

export class Container {
  private instances: Map<any, any> = new Map();

  constructor(private readonly modules: any[]) {
    this.initializeModules(modules);
  }

  private initializeModules(modules: any[]): void {
    for (const module of modules) {
      const metadata: ModuleMetadata = Reflect.getMetadata(
        'module:metadata',
        module
      );

      if (metadata && metadata.imports) {
        for (const provider of metadata.imports) {
          this.initializeImport(provider);
        }
      }

      if (metadata && metadata.providers) {
        for (const provider of metadata.providers) {
          this.initializeInstance(provider);
        }
      }

      if (metadata && metadata.controllers) {
        for (const controller of metadata.controllers) {
          this.initializeInstance(controller);
        }
      }
    }
  }

  private initializeImport(target: any): void {
    if (!this.instances.has(target)) {
      const instance = target;
      this.instances.set(target, instance);
    }
  }

  private initializeInstance(target: any): void {
    if (!this.instances.has(target)) {
      const params = Reflect.getMetadata('design:paramtypes', target) || [];
      const dependencies = params.map((param: any) => this.resolve(param));
      const instance = new target(...dependencies);
      this.instances.set(target, instance);
    }
  }

  public resolve<T>(dependency: any): T {
    if (!this.instances.has(dependency)) {
      throw new Error(
        `Dependency ${dependency.name} not found in the container.`
      );
    }
    return this.instances.get(dependency);
  }
}