import { Injectable } from "../src/di";

@Injectable()
export class TestAdapter {
    constructor() {}

    execute(): any {
        return "this would be some adapters response"
    }
}