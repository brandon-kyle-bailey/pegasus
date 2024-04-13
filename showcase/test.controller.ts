import { QueryBus } from "../src/cqrs";
import { Inject, Injectable } from "../src/di";
import { IController } from "../src/interface";
import { TestQuery } from "./test.query";

@Injectable()
export class TestController implements IController {
    constructor(@Inject(QueryBus) private readonly queryBus: QueryBus) {
    }
    async execute(dto: any): Promise<any> {
        const query = TestQuery.create({message: "this is a message"});
        return await this.queryBus.execute(query);
    }
}