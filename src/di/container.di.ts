import { ReflectMetadataEnum } from "../enum/reflect-metadata.enum";
import { ModuleMetadata } from "../interface";

interface DependencyInterface {
  key: any;
  instance: any;
}

export class Container {
  private _instances: Map<any, any> = new Map();
  private _exports: Set<any> = new Set();

  constructor(private readonly modules: any[]) {
    this._initializeModules(this.modules);
  }

  private _generateDependencyInterface(target: any): DependencyInterface {
    console.log("_generateDependencyInterface", target);
    if (typeof target === "object" && "key" in target && "instance" in target) {
      return target;
    }
    if (
      typeof target === "object" &&
      "provide" in target &&
      "useClass" in target
    ) {
      return { key: target.provide, instance: target.useClass };
    }
    return { key: target, instance: target };
  }

  private _initializeModules(modules: any[]): void {
    for (const module of modules) {
      console.log("_initializeModules", module);
      const dependency = this._generateDependencyInterface(module);
      console.log("_initializeModules.dependency", dependency);
      const metadata: ModuleMetadata = Reflect.getMetadata(
        ReflectMetadataEnum.MODULE_METADATA,
        dependency.instance
      );

      if (metadata && metadata.imports) {
        for (const importedItem of metadata.imports) {
          this._initializeImport(importedItem);
        }
      }

      if (metadata && metadata.providers) {
        for (const provider of metadata.providers) {
          this._initializeInstance(provider);
        }
      }

      if (metadata && metadata.controllers) {
        for (const controller of metadata.controllers) {
          this._initializeInstance(controller);
        }
      }

      if (metadata && metadata.exports) {
        for (const exportItem of metadata.exports) {
          this._registerExport(exportItem);
        }
      }
    }
  }

  private _initializeImport(importedItem: any): void {
    console.log("_initializeImport", importedItem);
    const dependency = this._generateDependencyInterface(importedItem);
    console.log("_initializeImport.dependency", dependency);
    if (this._instances.has(dependency.key)) {
      return;
    }

    if (this._isModule(dependency.instance)) {
      const metadata: ModuleMetadata = Reflect.getMetadata(
        ReflectMetadataEnum.MODULE_METADATA,
        dependency.instance
      );

      if (metadata) {
        this._initializeModules([dependency.instance]);
      }
    } else {
      this._initializeInstance(dependency.instance);
    }
  }

  private _isModule(item: any): boolean {
    console.log("._isModule", item);
    const dependency = this._generateDependencyInterface(item);
    return Reflect.hasMetadata(
      ReflectMetadataEnum.MODULE_METADATA,
      dependency.instance
    );
  }

  private _initializeInstance(target: any): void {
    console.log("_initializeInstance", target);
    const dependency = this._generateDependencyInterface(target);
    console.log("_initializeInstance.dependency", dependency);
    if (!this._instances.has(dependency.key)) {
      const params =
        Reflect.getMetadata(
          ReflectMetadataEnum.DESIGN_PARAMTYPES,
          dependency.instance
        ) || [];
      const dependencies = params.map((param: any) => this.resolve(param));
      const instance = new dependency.instance(...dependencies);
      this._instances.set(dependency.key, instance);
    }
  }

  private _registerExport(target: any): void {
    console.log("_registerExport", target);
    this._exports.add(target);
  }

  public resolve<T>(dependency: any): T {
    if (!this._instances.has(dependency) && !this._exports.has(dependency)) {
      throw new Error(
        `Dependency ${dependency.name} not found in the container.`
      );
    }
    return this._instances.get(dependency) || dependency;
  }

  public getExports(): Set<any> {
    return this._exports;
  }
}
