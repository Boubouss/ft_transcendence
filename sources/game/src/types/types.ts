export type SocketList = {
	[key: string]: WebSocket;
};

export type Player = {
	id: number;
	username: string;
	avatar: string;
};

export type Lobby = {
	owner: number;
	nb_players: number;
	ready: Player[];
	waiting: Player[];
};

export type Configuration = {
	id: number;
	is2FA: boolean;
};

export type User = {
	id: number;
	username: string;
	email: string;
	avatar: string;
	configuration?: Configuration;
};

export enum LobbyAction {
	JOIN = "JOIN",
	LEAVE = "LEAVE",
	READY = "READY",
	UNREADY = "UNREADY",
}

export type LobbyOption = {};

export type SocketMessage = {
	id: number;
	target: number;
	action: LobbyAction;
	option?: LobbyOption;
};
