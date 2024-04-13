import { Inject, Injectable } from "../src/di";
import { TestAdapter } from "./test.adapter";

@Injectable()
export class TestPort {
    constructor(@Inject(TestAdapter) private readonly adapter: TestAdapter) {
    }
    execute() {
        return this.adapter.execute();
    }
}