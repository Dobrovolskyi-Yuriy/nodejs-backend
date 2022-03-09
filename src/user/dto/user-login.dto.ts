import { IsEmail, IsString } from 'class-validator';

import { VALIDATION_MESSAGE } from '../../errors/error.messages';

export class UserLoginDto {
	@IsEmail({}, { message: VALIDATION_MESSAGE.email })
	email: string;

	@IsString({ message: VALIDATION_MESSAGE.password })
	password: string;
}
