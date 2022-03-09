import { config, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';

import { ILogger } from '../logger/logger.interface';
import { IConfigService } from './config.service.interface';

import { INJECTABLE_TYPES } from '../types';

@injectable()
export class ConfigService implements IConfigService {
	private _config: DotenvParseOutput;

	constructor(@inject(INJECTABLE_TYPES.ILogger) logger: ILogger) {
		const result = config();
		if (result.error) {
			logger.error('[ConfigService] Failed to read .env file or is missing');
		} else {
			logger.log('[ConfigService] File .env readed');
			this._config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this._config[key];
	}
}
