import { compare, hash } from 'bcryptjs';

export class UserEntity {
	constructor(
		private readonly _email: string,
		private readonly _name: string,
		private _passwordHash: string = '',
	) {}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	get password(): string {
		return this._passwordHash;
	}

	public async setPassword(pass: string, salt: number): Promise<void> {
		this._passwordHash = await hash(pass, salt);
	}

	public async comparePassword(pass: string): Promise<boolean> {
		return compare(pass, this._passwordHash);
	}
}
