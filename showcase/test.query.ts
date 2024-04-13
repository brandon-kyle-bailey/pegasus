import { Query, QueryProps } from "../src/ddd";

export class TestQuery extends Query {
  readonly message: string;
  private constructor(props: QueryProps<TestQuery>) {
    super(props);
    this.message = props.message;
  }
  static create(props: QueryProps<TestQuery>): TestQuery {
    return new TestQuery(props);
  }
}
