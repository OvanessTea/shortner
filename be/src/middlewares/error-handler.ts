import { NextFunction, Request, Response } from 'express';

import { CustomError } from '../errors/custom-error';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json(err.serializeError());
  }

  res.status(500).json({ message: 'Internal server error' });
};
