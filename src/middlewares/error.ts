import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/HttpError";

export function errorHandler(err: HttpError, req: Request, res: Response, next: NextFunction) {
  res.status(err.status || 500);
  res.json({ message: err.message, status: err.status, stack: err.stack });
}