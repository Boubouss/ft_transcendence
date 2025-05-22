import { Action } from "./enums";

export type SocketList = {
	[key: string]: WebSocket;
};

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

export type Player = {
	id: number;
	name: string;
	avatar: string;
};

export type Lobby = {
	id: number;
};

export type LobbyInfo = {
	lobby_id: number;
	player_limit: number;
	players: Player[];
}

export type LobbyCreate = {
	player_limit: number;
};

export type PlayerAction = {
	target_id: number;
	action: Action;
};
