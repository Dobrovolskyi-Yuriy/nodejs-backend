import { IsEmail, IsString } from 'class-validator';

import { VALIDATION_MESSAGE } from '../../errors/error.messages';

export class UserRegisterDto {
	@IsString({ message: VALIDATION_MESSAGE.name })
	name: string;

	@IsEmail({}, { message: VALIDATION_MESSAGE.email })
	email: string;

	@IsString({ message: VALIDATION_MESSAGE.password })
	password: string;
}
