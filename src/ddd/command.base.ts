import { v4 } from 'uuid';
import { CommandMetadata } from '../interface';

export type CommandProps<T> = Omit<T, 'id' | 'metadata'> & Partial<Command>;

export class Command {
  readonly id: string;
  readonly metadata: CommandMetadata;
  constructor(props: CommandProps<unknown>) {
    this.id = props.id || v4();
    this.metadata = {
      causationId: v4(),
      correlationId: v4(),
      timestamp: props?.metadata?.timestamp || Date.now(),
    };
  }
}