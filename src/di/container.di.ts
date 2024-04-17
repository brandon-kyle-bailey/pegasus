import { ReflectMetadataEnum } from "../enum/reflect-metadata.enum";
import { ILogger, ModuleMetadata } from "../interface";

enum DependencyInterfaceType {
  VALUE = "value",
  CLASS = "class",
}

interface DependencyInterface {
  key: any;
  instance: any;
  type: DependencyInterfaceType;
}

export class Container {
  private _instances: Map<any, any> = new Map();
  private _exports: Set<any> = new Set();

  constructor(
    private readonly modules: any[],
    private readonly logger: ILogger
  ) {
    this._initializeModules(this.modules);
  }

  private _generateDependencyInterface(target: any): DependencyInterface {
    if (
      typeof target === "object" &&
      "key" in target &&
      "instance" in target &&
      "type" in target
    ) {
      return target;
    }
    if (typeof target === "object" && "provide" in target) {
      if ("useClass" in target) {
        return {
          key: target.provide,
          instance: target.useClass,
          type: DependencyInterfaceType.CLASS,
        };
      } else {
        return {
          key: target.provide,
          instance: target.useValue,
          type: DependencyInterfaceType.VALUE,
        };
      }
    }
    return {
      key: target,
      instance: target,
      type:
        typeof target === "function" && target.prototype && target !== Object
          ? DependencyInterfaceType.CLASS
          : DependencyInterfaceType.VALUE,
    };
  }

  private _initializeModules(modules: any[]): void {
    for (const module of modules) {
      const dependency = this._generateDependencyInterface(module);
      const metadata: ModuleMetadata = Reflect.getMetadata(
        ReflectMetadataEnum.MODULE_METADATA,
        dependency.instance
      );

      if (metadata && metadata.imports) {
        this.logger.info(
          `[ _initializeModules ] ${module.name} Initializing imports...`,
          metadata.imports
        );
        for (const importedItem of metadata.imports) {
          this._initializeImport(importedItem);
        }
      }

      if (metadata && metadata.providers) {
        this.logger.info(
          `[ _initializeModules ] ${module.name} Initializing providers...`,
          metadata.providers
        );
        for (const provider of metadata.providers) {
          this._initializeInstance(provider);
        }
      }

      if (metadata && metadata.controllers) {
        this.logger.info(
          `[ _initializeModules ] ${module.name} Initializing controllers...`,
          metadata.controllers
        );
        for (const controller of metadata.controllers) {
          this._initializeInstance(controller);
        }
      }

      if (metadata && metadata.exports) {
        this.logger.info(
          `[ _initializeModules ] ${module.name} Initializing exports...`,
          metadata.exports
        );
        for (const exportItem of metadata.exports) {
          this._registerExport(exportItem);
        }
      }
    }
  }

  private _initializeImport(importedItem: any): void {
    const dependency = this._generateDependencyInterface(importedItem);
    this.logger.info(
      `[ _initializeImport ] ${dependency.key} Initializing import...`,
      dependency.instance
    );
    if (this._instances.has(dependency.key)) {
      return;
    }

    if (this._isModule(dependency.instance)) {
      const metadata: ModuleMetadata = Reflect.getMetadata(
        ReflectMetadataEnum.MODULE_METADATA,
        dependency.instance
      );

      if (metadata && metadata.exports) {
        for (const provider of metadata.exports) {
          this._initializeInstance(provider);
        }
        this._initializeInstance(dependency.instance);
      }
    } else {
      this._initializeInstance(dependency.instance);
    }
  }

  private _isInjectable(item: any): boolean {
    const dependency = this._generateDependencyInterface(item);
    this.logger.info(
      `[ _isInjectable ] ${dependency.key} Validating ${dependency.type} is injectable...`,
      dependency.instance
    );
    if (
      this._isModule(dependency) ||
      dependency.type === DependencyInterfaceType.VALUE
    ) {
      return true;
    }
    return Reflect.hasMetadata(
      ReflectMetadataEnum.DESIGN_INJECTABLE,
      dependency.instance
    );
  }

  private _isModule(item: any): boolean {
    const dependency = this._generateDependencyInterface(item);
    this.logger.info(
      `[ _isModule ] ${dependency.key} Is module...`,
      dependency.instance
    );
    return Reflect.hasMetadata(
      ReflectMetadataEnum.MODULE_METADATA,
      dependency.instance
    );
  }

  private _initializeInstance(target: any): void {
    const dependency = this._generateDependencyInterface(target);
    this.logger.info(
      `[ _initializeInstance ] ${dependency.key} Initializing dependency...`,
      dependency.instance
    );
    if (!this._isInjectable(dependency)) {
      const message = `[ _initializeInstance ] ${dependency.key} Does not support injection. Ensure proper use of @Injectable().`;
      this.logger.error(message);
      throw new Error(message);
    }
    if (!this._instances.has(dependency.key)) {
      if (dependency.type === DependencyInterfaceType.VALUE) {
        this._instances.set(dependency.key, dependency.instance);
      } else {
        const params =
          Reflect.getMetadata(
            ReflectMetadataEnum.DESIGN_PARAMTYPES,
            dependency.instance
          ) || [];
        const dependencies = params.map((param: any) => {
          const dep = this._generateDependencyInterface(param);
          return this.resolve(dep.key);
        });
        const instance = new dependency.instance(...dependencies);
        this._instances.set(dependency.key, instance);
      }
    }
  }

  private _registerExport(target: any): void {
    this.logger.info(
      `[ _registerExport ] ${target} Registering export...`,
      target
    );
    this._exports.add(target);
  }

  public resolve<T>(target: any): T {
    const dependency = this._generateDependencyInterface(target);
    this.logger.info(
      `[ resolve ] ${dependency.key} Resolving dependency...`,
      dependency.instance
    );
    if (
      !this._instances.has(dependency.key) &&
      !this._exports.has(dependency.key)
    ) {
      const message = `[ resolve ] Dependency ${dependency.key} not found in the container. Are you missing a provider?`;
      this.logger.error(message);
      throw new Error(message);
    }
    return this._instances.get(dependency.key) || dependency;
  }

  public getExports(): Set<any> {
    return this._exports;
  }
}
