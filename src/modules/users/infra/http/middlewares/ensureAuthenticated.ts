import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import AppError from '@shared/errors/AppError';

interface ITokenPayload {
  iat: number;
  expiresIn: number;
  subject: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token is missing.', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decodedToken = verify(token, '123456');

    const { subject } = decodedToken as ITokenPayload;

    request.user = {
      id: subject,
    };

    return next();
  } catch (err) {
    throw new AppError('Invalid token', 401);
  }
}
