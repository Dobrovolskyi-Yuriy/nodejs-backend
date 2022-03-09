import { Container } from 'inversify';
import { UserModel } from '@prisma/client';
import 'reflect-metadata';

import { UserService } from './user.service';

import { UserEntity } from './user.entity';

import { IConfigService } from '../config/config.service.interface';
import { IUserRepository, IUserService } from './user.interfaces';

import { INJECTABLE_TYPES } from '../types';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UserRepositoryMock: IUserRepository = {
	create: jest.fn(),
	find: jest.fn(),
};

const container = new Container();
let userService: IUserService;
let configSerice: IConfigService;
let userRepository: IUserRepository;

beforeAll(() => {
	container.bind<IUserService>(INJECTABLE_TYPES.UserService).to(UserService);
	container.bind<IConfigService>(INJECTABLE_TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container
		.bind<IUserRepository>(INJECTABLE_TYPES.UserRepository)
		.toConstantValue(UserRepositoryMock);

	userService = container.get<IUserService>(INJECTABLE_TYPES.UserService);
	configSerice = container.get<IConfigService>(INJECTABLE_TYPES.ConfigService);
	userRepository = container.get<IUserRepository>(INJECTABLE_TYPES.UserRepository);
});

let createdUser: UserModel | null;

describe('UserService', () => {
	it('createUser', async () => {
		configSerice.get = jest.fn().mockReturnValueOnce('test');
		userRepository.create = jest.fn().mockImplementationOnce(
			({ name, email, password }: UserEntity): UserModel => ({
				name,
				email,
				password,
				id: 1,
			}),
		);

		createdUser = await userService.createUser({
			email: 'email@test.com',
			name: 'testName',
			password: 'testPassword',
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('testPassword');
	});

	it('validateUser - success', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await userService.validateUser({
			email: 'email@test.com',
			password: 'testPassword',
		});

		expect(res).toBeTruthy();
	});

	it('validateUser - wrong password', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await userService.validateUser({
			email: 'email@test.com',
			password: 'wrongPassword',
		});

		expect(res).toBeFalsy();
	});

	it('validateUser - user not found', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(null);
		const res = await userService.validateUser({
			email: 'email@test.com',
			password: 'testPassword',
		});

		expect(res).toBeFalsy();
	});
});
