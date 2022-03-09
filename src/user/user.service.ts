import { inject, injectable } from 'inversify';
import { UserModel } from '@prisma/client';

import { UserEntity } from './user.entity';

import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

import { IUserRepository, IUserService } from './user.interfaces';
import { IConfigService } from '../config/config.service.interface';

import { INJECTABLE_TYPES } from '../types';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(INJECTABLE_TYPES.ConfigService) private configService: IConfigService,
		@inject(INJECTABLE_TYPES.UserRepository) private userRepository: IUserRepository,
	) {}

	public async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const existedUser = await this.userRepository.find(email);
		if (existedUser) {
			return null;
		}
		const newUser = new UserEntity(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		return this.userRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.userRepository.find(email);
		if (!existedUser) {
			return false;
		}
		const user = new UserEntity(existedUser.email, existedUser.name, existedUser.password);
		return user.comparePassword(password);
	}

	getUserInfo(email: string): Promise<UserModel | null> {
		return this.userRepository.find(email);
	}
}
