export interface QueryMetadata {
  readonly correlationId: string;
  readonly causationId: string;
  readonly timestamp: number;
};
