# Pegasus

A lightweight, platform agnostic framework for Dependency Injection, event based domain driven architecture with CQRS

## Installation

```ts
npm install @produce8/pegasus
```

or

```ts
yarn add @produce8/pegasus
```

## Examples

### Basic use case

Defining an Injectable provider

```ts
// some-injectable.application-service.ts

import { Inject, Injectable, IApplicationService } from "@produce8/pegasus";

@Injectable()
export class SomeInjectableApplicationService implements IApplicationService {
  constructor(
    @Inject(SomeInjectableAdapter) readonly adapter: SomeInjectableAdapter
  ) {}
  async execute(query: Query): Promise<any> {
    try {
      return await this.adapter.execute();
    } catch (error) {
      throw new Error(error);
    }
  }
}
```

Defining an injectable controller

```ts
import { IController, Inject, Injectable } from "@produce8/pegasus";

@Injectable()
export class SomeInjectableController implements IController {
  constructor(
    @Inject(SomeInjectableApplicationService)
    private readonly service: SomeInjectableApplicationService
  ) {}
  async execute(dto: any): Promise<any> {
    try {
      const result = await this.service.execute(dto);
      console.log(
        "SomeInjectableController.execute.service.execute result",
        result
      );
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
```

Defining a module

```ts
// app.module.ts

import { Module } from "@produce8/pegasus";
...

@Module({
  imports: [],
  providers: [SomeInjectableApplicationService],
  controllers: [SomeInjectableController],
})
export default class AppModule {}
```

Resolving and invoking dependencies

```ts
...
import { PegasusFactory } from "@produce8/pegasus";

const bootstrap = async () => {
  const app = PegasusFactory.create(AppModule, { debug: true });
  const controller = app.resolve<SomeInjectableController>(SomeInjectableController);
  await controller.execute("some input");
};
```

Output

```ts
[ Pegasus ] - [ 2024-04-16T00:45:06.697Z [ INFO [ [ ImporterAppModule ] Loading Dependencies... ] ] ] []
[ Pegasus ] - [ 2024-04-16T00:45:06.698Z [ INFO [ [ _initializeModules ] ImporterAppModule Initializing imports... ] ] ] [ [ [class ExporterAppModule] ] ]
[ Pegasus ] - [ 2024-04-16T00:45:06.698Z [ INFO [ [ _initializeImport ] class ExporterAppModule {
} Initializing import... ] ] ] [ [class ExporterAppModule] ]
[ Pegasus ] - [ 2024-04-16T00:45:06.698Z [ INFO [ [ _isModule ] class ExporterAppModule {
} Is module... ] ] ] [ [class ExporterAppModule] ]
[ Pegasus ] - [ 2024-04-16T00:45:06.699Z [ INFO [ [ _initializeModules ] ExporterAppModule Initializing imports... ] ] ] [ [] ]
[ Pegasus ] - [ 2024-04-16T00:45:06.699Z [ INFO [ [ _initializeModules ] ExporterAppModule Initializing providers... ] ] ] [
  [ [class ExporterAppAdapter], [class ExporterAppApplicationService] ]
]
[ Pegasus ] - [ 2024-04-16T00:45:06.699Z [ INFO [ [ _initializeInstance ] class ExporterAppAdapter {
    constructor() { }
    execute() {
        return "ExporterAppAdapter.execute called";
    }
} Initializing dependency... ] ] ] [ [class ExporterAppAdapter] ]
[ Pegasus ] - [ 2024-04-16T00:45:06.699Z [ INFO [ [ _initializeInstance ] class ExporterAppApplicationService {
    constructor(adapter) {
        this.adapter = adapter;
    }
    execute(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.adapter.execute();
        });
    }
} Initializing dependency... ] ] ] [ [class ExporterAppApplicationService] ]
[ Pegasus ] - [ 2024-04-16T00:45:06.699Z [ INFO [ [ resolve ] class ExporterAppAdapter {
    constructor() { }
    execute() {
        return "ExporterAppAdapter.execute called";
    }
} Resolving dependency... ] ] ] [ [class ExporterAppAdapter] ]
[ Pegasus ] - [ 2024-04-16T00:45:06.699Z [ INFO [ [ _initializeModules ] ExporterAppModule Initializing controllers... ] ] ] [ [ [class ExporterAppController] ] ]
[ Pegasus ] - [ 2024-04-16T00:45:06.699Z [ INFO [ [ _initializeInstance ] class ExporterAppController {
    constructor(service) {
        this.service = service;
    }
    execute(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.service.execute(dto);
                console.log("ExporterAppController.execute.service.execute result", result);
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
} Initializing dependency... ] ] ] [ [class ExporterAppController] ]
[ Pegasus ] - [ 2024-04-16T00:45:06.699Z [ INFO [ [ resolve ] class ExporterAppApplicationService {
    constructor(adapter) {
        this.adapter = adapter;
    }
    execute(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.adapter.execute();
        });
    }
} Resolving dependency... ] ] ] [ [class ExporterAppApplicationService] ]
[ Pegasus ] - [ 2024-04-16T00:45:06.699Z [ INFO [ [ _initializeModules ] ExporterAppModule Initializing exports... ] ] ] [ [ [class ExporterAppAdapter] ] ]
[ Pegasus ] - [ 2024-04-16T00:45:06.699Z [ INFO [ [ _registerExport ] class ExporterAppAdapter {
    constructor() { }
    execute() {
        return "ExporterAppAdapter.execute called";
    }
} Registering export... ] ] ] [ [class ExporterAppAdapter] ]
[ Pegasus ] - [ 2024-04-16T00:45:06.699Z [ INFO [ [ _initializeModules ] ImporterAppModule Initializing providers... ] ] ] [ [ [class ImporterAppApplicationService] ] ]
[ Pegasus ] - [ 2024-04-16T00:45:06.699Z [ INFO [ [ _initializeInstance ] class ImporterAppApplicationService {
    constructor(adapter) {
        this.adapter = adapter;
    }
    execute(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.adapter.execute();
        });
    }
} Initializing dependency... ] ] ] [ [class ImporterAppApplicationService] ]
[ Pegasus ] - [ 2024-04-16T00:45:06.699Z [ INFO [ [ resolve ] class ExporterAppAdapter {
    constructor() { }
    execute() {
        return "ExporterAppAdapter.execute called";
    }
} Resolving dependency... ] ] ] [ [class ExporterAppAdapter] ]
[ Pegasus ] - [ 2024-04-16T00:45:06.699Z [ INFO [ [ _initializeModules ] ImporterAppModule Initializing controllers... ] ] ] [ [ [class ImporterAppController] ] ]
[ Pegasus ] - [ 2024-04-16T00:45:06.699Z [ INFO [ [ _initializeInstance ] class ImporterAppController {
    constructor(service) {
        this.service = service;
    }
    execute(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.service.execute(dto);
                console.log("ImporterAppController.execute.service.execute result", result);
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
} Initializing dependency... ] ] ] [ [class ImporterAppController] ]
[ Pegasus ] - [ 2024-04-16T00:45:06.700Z [ INFO [ [ resolve ] class ImporterAppApplicationService {
    constructor(adapter) {
        this.adapter = adapter;
    }
    execute(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.adapter.execute();
        });
    }
} Resolving dependency... ] ] ] [ [class ImporterAppApplicationService] ]
[ Pegasus ] - [ 2024-04-16T00:45:06.700Z [ INFO [ [ ImporterAppModule ] Dependencies loaded... ] ] ] [ '3ms' ]
[ Pegasus ] - [ 2024-04-16T00:45:06.700Z [ INFO [ [ resolve ] class ImporterAppController {
    constructor(service) {
        this.service = service;
    }
    execute(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.service.execute(dto);
                console.log("ImporterAppController.execute.service.execute result", result);
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
} Resolving dependency... ] ] ] [ [class ImporterAppController] ]

ImporterAppController.execute.service.execute result ExporterAppAdapter.execute called
```

### Imports and Exports

Beyond the typical module definition. It's also possible to define exports from one module and import them into another

```ts
// module that defines an export

@Module({
  imports: [],
  providers: [ExporterAppAdapter, ExporterAppApplicationService],
  controllers: [ExporterAppController],
  exports: [ExporterAppAdapter],
})
export default class ExporterAppModule {}
```

```ts
// module that imports the exported module
@Module({
  imports: [ExporterAppModule],
  providers: [ImporterAppApplicationService],
  controllers: [ImporterAppController],
})
export default class ImporterAppModule {}
```

### Config Service

A basic, injectable ConfigService is included

```ts
import { Injectable } from "../di";
import { IConfigService } from "../interface";

@Injectable()
export class ConfigServie implements IConfigService {
  private _env: { [key: string]: any } = {};
  constructor(initConfig: { [key: string]: any }) {
    this._env = initConfig;
  }
  get<T>(key: string): T {
    return this._env[key];
  }
  getOrThrow<T>(key: string): T {
    const val = this._env[key];
    if (val) {
      throw new Error(`${key} does not exist`);
    }
    return val;
  }
  set<T>(key: string, value: T): void {
    this._env[key] = value;
  }
}
```

And used as such

```ts
const configService = app.resolve<ConfigService>(ConfigService);
configService.set("some_key", "some_value");
```

A ConfigModule also exists to inject an environment during bootstrap and expose a globally available ConfigService
scoped to the given module.

```ts
@Module({
  imports: [
    ConfigModule.forRoot({ debug: true, endpoint: "https.google.com" }),
  ],
  providers: [],
  controllers: [ImporterAppController],
})
export default class ImporterAppModule {}
```

The controller can then inject the ConfigService without needing to define it as a provider.

### Interface Imports

Interface keys can be used to provide dependencies

```ts
// module that imports the exported module
@Module({
  imports: [],
  providers: [{ provide: "SomeKey", useClase: ImporterAppApplicationService }],
  controllers: [ImporterAppController],
})
export default class ImporterAppModule {}
```

And referenced in the controller like so:

```ts
import { IController, Inject, Injectable } from "@produce8/pegasus";
import { ImporterAppApplicationService } from "../../../core/application/services/importer-app/importer-app.application-service";

@Injectable()
export class ImporterAppController implements IController {
  constructor(
    @Inject("SomeKey")
    private readonly service: ImporterAppApplicationService
  ) {}
  async execute(dto: any): Promise<any> {
    try {
      const result = await this.service.execute(dto);
      console.log(
        "ImporterAppController.execute.service.execute result",
        result
      );
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
```
