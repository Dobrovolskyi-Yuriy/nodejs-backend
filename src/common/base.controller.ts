import { injectable } from 'inversify';
import { Response, Router } from 'express';
import 'reflect-metadata';

import { IExpressResponseType, IControllerRoute } from './interfaces';
import { ILogger } from '../logger/logger.interface';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	protected ok<T>(res: Response, message: T): IExpressResponseType {
		return res.status(200).json(message);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		routes.forEach((route) => {
			this.logger.log(`[${route.method}] ${route.path}`);
			const middleware = route.middlewares?.map((m) => m.execute.bind(m));
			const handler = route.func.bind(this);
			const pipeline = middleware ? [...middleware, handler] : handler;
			this._router[route.method](route.path, pipeline);
		});
	}

	get router(): Router {
		return this._router;
	}
}
