import AppModule from "./app.module";
import { TestController } from "./test.controller";
import { ModuleFactory } from "../src/di";

const execute = async () => {
  const app = ModuleFactory.create(AppModule);
  const controller = app.resolve<TestController>(TestController);
  const result = await controller.execute("test");
  console.log(result);
};

execute();