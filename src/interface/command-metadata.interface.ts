export interface CommandMetadata {
  readonly correlationId: string;
  readonly causationId: string;
  readonly timestamp: number;
};
