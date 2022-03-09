import { injectable } from 'inversify';
import { Logger as TSLogger } from 'tslog';
import 'reflect-metadata';

import { ILogger } from './logger.interface';

@injectable()
export class LoggerService implements ILogger {
	logger: TSLogger;

	constructor() {
		this.logger = new TSLogger({
			displayInstanceName: false,
			displayLoggerName: false,
			displayFilePath: 'hidden',
			displayFunctionName: false,
		});
	}

	public log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	public error(...args: unknown[]): void {
		this.logger.error(...args);
	}

	public warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}
