import { Query } from "../ddd";

export interface IQueryHandler {
  execute(query: Query): any;
}