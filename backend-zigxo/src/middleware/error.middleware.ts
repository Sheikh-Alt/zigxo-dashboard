import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Multer errors (file size exceeded, unexpected field, etc.) → 400
  if (err instanceof multer.MulterError) {
    sendError(res, `Upload error: ${err.message}`, 400);
    return;
  }

  const statusCode = err.statusCode ?? 500;
  logger.error(`${statusCode} — ${err.message}`);
  sendError(res, err.message, statusCode);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, `Route ${req.method} ${req.url} not found`, 404);
};
