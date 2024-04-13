import { v4 } from 'uuid';
import { QueryMetadata } from '../interface/query-metadata.interface';

export type QueryProps<T> = Omit<T, 'id' | 'metadata'> & Partial<Query>;

export class Query {
  readonly id: string;
  readonly metadata: QueryMetadata;
  constructor(props: QueryProps<unknown>) {
    this.id = props.id || v4();
    this.metadata = {
      causationId: v4(),
      correlationId: v4(),
      timestamp: props?.metadata?.timestamp || Date.now(),
    };
  }
}