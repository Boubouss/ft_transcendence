import { WebSocket } from "@fastify/websocket";

export type Configuration = {
	id: number;
	is2FA: boolean;
};

export type ConfigAuth = Configuration & {
	code2FA: string;
};

export type User = {
	id: number;
	username: string;
	email: string;
	avatar: string;
	configuration?: Configuration;
};

export type UserCreate = {
	username: string;
	email: string;
	avatar: string;
	password: string;
};

export type UserUpdate = {
	id: number;
	username?: string;
	email?: string;
	avatar?: string;
	password?: string;
	configuration: Configuration;
};

export type UserAuth = {
	id: number;
	email: string;
	password: string;
	configuration: ConfigAuth;
};

export type Credential = {
	username: string;
	password: string;
};

export type Credential2FA = {
	username: string;
	code: string;
};

export type Friend = {
	id: number;
	username: string;
	avatar: string;
};

export type FriendList = {
	friends: Friend[];
};

export type FriendRequestList = {
	receiver: Friend[];
};

export type FriendShip = {
	userId: number;
	online: Friend[];
	offline: Friend[];
	requests: Friend[];
};

export type SocketList = {
	[key: string]: WebSocket;
};

export enum FriendRequestAction {
	SEND = "SEND",
	ACCEPT = "ACCEPT",
	DECLINE = "DECLINE",
}

export type SocketMessage = {
	id: number;
	action: FriendRequestAction;
};

export type SocketResponse = {
	from: Friend;
	what: FriendRequestAction;
};
