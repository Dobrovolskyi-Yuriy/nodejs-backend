import { UserModel } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

import { BaseController } from '../common/base.controller';

import { UserEntity } from './user.entity';

import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

export interface IUserController extends BaseController {
	login: (req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction) => Promise<void>;
	register: (
		req: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	) => Promise<void>;
	info: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
	getUserInfo: (email: string) => Promise<UserModel | null>;
}

export interface IUserRepository {
	create: (user: UserEntity) => Promise<UserModel>;
	find: (email: string) => Promise<UserModel | null>;
}
