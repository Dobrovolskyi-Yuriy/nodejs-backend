import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { UserEntity } from './user.entity';

import { IUserRepository } from './user.interfaces';
import { IPrismaService } from '../database/prisma.service.interface';

import { INJECTABLE_TYPES } from '../types';

@injectable()
export class UserRepository implements IUserRepository {
	constructor(@inject(INJECTABLE_TYPES.PrismaService) private prismaService: IPrismaService) {}

	public create({ name, email, password }: UserEntity): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				name,
				email,
				password,
			},
		});
	}

	public find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
}
