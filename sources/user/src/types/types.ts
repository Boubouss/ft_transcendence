export type Configuration = {
	id?: number;
	userId?: number;
	code2FA?: string;
	is2FA: boolean;
};

export type User = {
	id: number;
	name: string;
	email: string;
	avatar?: string;
	password?: string;
	configuration: Configuration;
};

export type Credential = {
	email: string;
	password: string;
};

export type Credential2FA = {
	email: string;
	code: string;
};
