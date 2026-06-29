import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
): void => {
  const body: ApiResponse<T> = { success: true, message, data };
  res.status(statusCode).json(body);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  error?: string,
): void => {
  const body: ApiResponse = { success: false, message, error };
  res.status(statusCode).json(body);
};
