import { ErrorCode } from './errCode';

export class ErrorException extends Error {
  public status: number = null;
  public message: string = null;
  public metaData: any = null;

  constructor(code: string = ErrorCode.UnknownError, metaData: any = null) {
    super(code);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = code;
    this.status = 500;
    this.message = code;
    this.metaData = metaData;

    switch (code) {
      case ErrorCode.Unauthenticated:
        this.status = 401;
        break;
      case ErrorCode.InvalidPassword:
        this.status = 401;
        break;
      case ErrorCode.NotFound:
        this.status = 404;
        break;
      default:
        this.status = 500;
        break;
    }
  }
}
