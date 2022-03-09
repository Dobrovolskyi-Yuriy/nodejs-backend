import { PrismaClient } from '@prisma/client';

export interface IPrismaService {
	readonly client: PrismaClient;
	connect: () => Promise<void>;
	disconnect: () => Promise<void>;
}
