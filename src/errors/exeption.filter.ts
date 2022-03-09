import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import 'reflect-metadata';

import { HTTPError } from './http-error.class';

import { IExeptionFilter } from './exeption.filter.interface';
import { ILogger } from '../logger/logger.interface';

import { INJECTABLE_TYPES } from '../types';

@injectable()
export class ExeptionFilter implements IExeptionFilter {
	constructor(@inject(INJECTABLE_TYPES.ILogger) private logger: ILogger) {}

	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.logger.error(`[ExeptionFilter] Error ${err.statusCode}: ${err.message}`);
			res.status(err.statusCode).send({ err: err.message });
		} else {
			this.logger.error(`[ExeptionFilter] Error: ${err.message}`);
			res.status(500).send({ err: err.message });
		}
	}
}
