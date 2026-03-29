export class BaseResult<T> {
  public success: boolean;
  public data?: T;
  public message?: string;

  error(message: string): BaseResult<T> {
    this.success = false;
    this.message = message;
    return this;
  }

  ok(data: T): BaseResult<T> {
    this.success = true;
    this.data = data;
    return this;
  }
}
