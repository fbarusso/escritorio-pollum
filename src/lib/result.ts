interface Failure<T> {
  success: false;
  error: T;
}

interface Success<T> {
  success: true;
  value: T;
}

export type Result<T, E = T> = Failure<T> | Success<E>;

export const Failure = <T>(error: T): Failure<T> => ({ success: false, error });

export const Success = <T>(value: T): Success<T> => ({ success: true, value });
