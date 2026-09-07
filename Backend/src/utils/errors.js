export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function assertFound(value, message = 'Resource not found') {
  if (!value) throw new AppError(message, 404, 'NOT_FOUND');
  return value;
}
