import { WebSocket } from "@fastify/websocket";

export type Configuration = {
	id: number;
	is2FA: boolean;
};

export type ConfigAuth = Configuration & {
	code2FA: string;
}

export type User = {
	id: number;
	name: string;
	email: string;
	avatar: string;
	configuration?: Configuration;
};

export type UserCreate = {
	name: string;
	email: string;
	avatar: string;
	password: string;
}

export type UserUpdate = {
	id: number;
	name?: string;
	email?: string;
	avatar?: string;
	password?: string;
	configuration: Configuration;
}

export type UserAuth = {
	email: string;
	password: string;
	configuration: ConfigAuth;
};

export type UserFriend = {
	id: number;
	name: string;
	avatar: string;
}

export type FriendList = UserFriend[];

export type Credential = {
	email: string;
	password: string;
};

export type Credential2FA = {
	email: string;
	code: string;
};

export type FriendShip = {
	userId: number;
	online: UserFriend[];
	offline: UserFriend[];
}

export type Connected = {
	[key: number]: WebSocket;
}