import { Command, Query } from "../ddd";

export interface IApplicationService {
    execute(payload: Command | Query): Promise<any>
}