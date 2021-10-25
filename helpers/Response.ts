// TODO: remove types or use them
class Response<T> {
  isSuccess: boolean;
  error: T | undefined;
  private payload: T | undefined;

  constructor(isSuccess: boolean, error?: T, value?: T) {
    if (isSuccess && error) {
      throw new Error(
        "InvalidOperation: Cannot have both success and error at the same time"
      );
    }
    if (!isSuccess && !error) {
      throw new Error("InvalidOperation: error message is mandatory");
    }

    this.isSuccess = isSuccess;
    this.error = error;
    this.payload = value;

    Object.freeze(this);
  }

  static ok<U>(value?: U): Response<U> {
    return new Response<U>(true, undefined, value);
  }

  static fail<U>(error: U): Response<U> {
    return new Response<U>(false, error);
  }
}

export default Response;
