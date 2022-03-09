import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import 'reflect-metadata';

import { BaseController } from '../common/base.controller';
import { ValidateMiddleware } from '../common/validate.middleware';
import { AuthGuard } from '../common/auth.guard';

import { HTTPError } from '../errors/http-error.class';

import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

import { IUserController, IUserService } from './user.interfaces';
import { ILogger } from '../logger/logger.interface';
import { IConfigService } from '../config/config.service.interface';

import { INJECTABLE_TYPES } from '../types';
import { STATUS_MESSAGE } from '../errors/error.messages';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(INJECTABLE_TYPES.ILogger) logger: ILogger,
		@inject(INJECTABLE_TYPES.UserService) private userService: IUserService,
		@inject(INJECTABLE_TYPES.ConfigService) private configService: IConfigService,
	) {
		super(logger);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					} else {
						resolve(token as string);
					}
				},
			);
		});
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(body);
		if (!result) {
			return next(new HTTPError(401, STATUS_MESSAGE[401]));
		}
		const jwt = await this.signJWT(body.email, this.configService.get('SECRET'));
		this.ok(res, { jwt });
	}

	async register(
		req: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(req.body);
		if (!result) {
			return next(new HTTPError(422, STATUS_MESSAGE[422]));
		}
		this.login(req, res, next);
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		if (!user) {
			return next(new HTTPError(401, STATUS_MESSAGE[401]));
		}
		const { id, name, email } = (await this.userService.getUserInfo(user.email)) ?? {};
		this.ok(res, { id, name, email });
	}
}
