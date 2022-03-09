import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

import { IMiddleware } from './interfaces';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		try {
			const { authorization } = req.headers;
			if (authorization) {
				const token = authorization.split(' ')[1];
				const { email } = verify(token, this.secret) as JwtPayload;
				req.user = {
					email,
				};
			}
			next();
		} catch {
			next();
		}
	}
}
