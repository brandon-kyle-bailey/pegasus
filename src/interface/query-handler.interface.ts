import { Query } from '../ddd/query.base';

export interface IQueryHandler {
  execute(query: Query): any;
}