class AppError {
  public readonly message: string;

  public readonly name: string;

  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    this.name = 'AppError';
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default AppError;
