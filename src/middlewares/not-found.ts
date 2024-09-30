import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/HttpError';

export function notFoundHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const error = new HttpError('Not Found', 404);
	next(error);
}
