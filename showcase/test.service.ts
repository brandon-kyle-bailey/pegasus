import { QueryHandler } from "../src/decorator";
import { Inject, Injectable } from "../src/di";
import { IApplicationService } from "../src/interface";
import { TestPort } from "./test.port";
import { TestQuery } from "./test.query";

@Injectable()
@QueryHandler(TestQuery)
export class TestQueryApplicationService implements IApplicationService {
    constructor(@Inject(TestPort) readonly port: TestPort) {
    }
    async execute(query: TestQuery): Promise<any> {
        console.log('Hey im inside this application service', query);
        console.log('invoking some port method', this.port.execute());
        return query.message;
    }
}