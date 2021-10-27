interface ErrorResponse {
  message: string;
}

class Response {
  isSuccess: boolean;
  error: ErrorResponse | undefined;
  payload: any;

  constructor(isSuccess: boolean, error?: ErrorResponse, value?: any) {
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

  static ok(value?: any): Response {
    return new this(true, undefined, value);
  }

  static fail(error: ErrorResponse): Response {
    return new this(false, error);
  }
}

export default Response;
