type Configuration = {
	id: number;
	is2FA: boolean;
};

export type User = {
	id: number;
	name: string;
	email: string;
	avatar: string;
	configuration?: Configuration;
};
