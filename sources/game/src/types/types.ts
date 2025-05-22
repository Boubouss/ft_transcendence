export type SocketList = {
	[key: string]: WebSocket;
};

export type Player = {
	id: number;
	username: string;
	avatar: string;
};

export type Lobby = {
	owner_id: number;
	player_limit: number;
	players: Player[];
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
}

export type LobbyOption = {};

export type CreateMessage = {
	player_id: number;
	player_limit: number;
};

export type ActionMessage = {
	player_id: number;
	target_id: number;
	action: LobbyAction;
	option?: LobbyOption;
};
