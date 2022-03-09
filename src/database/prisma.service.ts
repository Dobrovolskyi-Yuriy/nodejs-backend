import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { IPrismaService } from './prisma.service.interface';
import { ILogger } from '../logger/logger.interface';

import { INJECTABLE_TYPES } from '../types';

@injectable()
export class PrismaService implements IPrismaService {
	private readonly _client: PrismaClient;

	constructor(@inject(INJECTABLE_TYPES.ILogger) private logger: ILogger) {
		this._client = new PrismaClient();
	}

	public async connect(): Promise<void> {
		await this._client.$connect();
		this.logger.log('[PrismaService] Connected');
	}

	public async disconnect(): Promise<void> {
		await this._client.$disconnect();
		this.logger.log('[PrismaService] Disconnected');
	}

	get client(): PrismaClient {
		return this._client;
	}
}
