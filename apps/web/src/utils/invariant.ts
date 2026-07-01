export class InvariantError extends Error {
  readonly name = 'InvariantError';

  constructor(message: string) {
    super(message);
  }
}

export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new InvariantError(message);
  }
}

export function assertDefined<T>(value: T, message: string): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new InvariantError(message);
  }
}
