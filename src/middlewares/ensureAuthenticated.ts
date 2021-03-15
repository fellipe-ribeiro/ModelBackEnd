import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';

import AppError from '../errors/AppError';

interface ITokenPayload {
  iat: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  reponse: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT tokens is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as ITokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
