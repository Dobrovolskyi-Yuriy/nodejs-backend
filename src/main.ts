import { Container, ContainerModule, interfaces } from 'inversify';

import { App } from './app';

import { LoggerService } from './logger/logger.service';
import { ExeptionFilter } from './errors/exeption.filter';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserRepository } from './user/user.repository';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';

import { ILogger } from './logger/logger.interface';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { IUserController, IUserRepository, IUserService } from './user/user.interfaces';
import { IConfigService } from './config/config.service.interface';
import { IPrismaService } from './database/prisma.service.interface';

import { INJECTABLE_TYPES } from './types';

interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(INJECTABLE_TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExeptionFilter>(INJECTABLE_TYPES.ExeptionFilter).to(ExeptionFilter).inSingletonScope();
	bind<IUserController>(INJECTABLE_TYPES.UserController).to(UserController).inSingletonScope();
	bind<IUserService>(INJECTABLE_TYPES.UserService).to(UserService).inSingletonScope();
	bind<IUserRepository>(INJECTABLE_TYPES.UserRepository).to(UserRepository).inSingletonScope();
	bind<IPrismaService>(INJECTABLE_TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IConfigService>(INJECTABLE_TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<App>(INJECTABLE_TYPES.Application).to(App).inSingletonScope();
});

async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(INJECTABLE_TYPES.Application);
	await app.init();
	return { appContainer, app };
}

bootstrap();
