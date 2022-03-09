import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { json } from 'body-parser';
import 'reflect-metadata';

import { AuthMiddleware } from './common/auth.middleware';

import { ILogger } from './logger/logger.interface';
import { IConfigService } from './config/config.service.interface';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { IUserController } from './user/user.interfaces';
import { IPrismaService } from './database/prisma.service.interface';

import { INJECTABLE_TYPES } from './types';

@injectable()
export class App {
	private _app: Express;
	private server: Server;
	private port: number;

	constructor(
		@inject(INJECTABLE_TYPES.ILogger) private logger: ILogger,
		@inject(INJECTABLE_TYPES.UserController) private userController: IUserController,
		@inject(INJECTABLE_TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(INJECTABLE_TYPES.ConfigService) private configService: IConfigService,
		@inject(INJECTABLE_TYPES.PrismaService) private prismaService: IPrismaService,
	) {
		this._app = express();
		this.port = 8000;
	}

	get app(): Express {
		return this._app;
	}

	private useMiddleware(): void {
		this._app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this._app.use(authMiddleware.execute.bind(authMiddleware));
	}

	private useRoutes(): void {
		this._app.use('/users', this.userController.router);
	}

	private useExeptionFilters(): void {
		this._app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilters();
		await this.prismaService.connect();
		this.server = this._app.listen(this.port, () => {
			this.logger.log(`Server started http://localhost:${this.port}`);
		});
	}

	public close(): void {
		this.server.close();
	}
}
