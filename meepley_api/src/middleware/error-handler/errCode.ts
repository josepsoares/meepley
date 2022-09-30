export class ErrorCode {
  public static readonly Unauthenticated =
    'The operation failed because the it was called an authenticated route without a valid authentication token';
  public static readonly NotFound =
    'The operation failed because the wanted record(s) were not found';
  public static readonly InvalidPassword =
    'The operation failed because the user provided a wrong password in the authentication process';
  public static readonly UnknownError =
    'The operation failed because of an unknow error';
}
