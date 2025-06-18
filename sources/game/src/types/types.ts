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

export type MatchCreate = {
	user_ids: number[];
};

export type PlayerInfo = {
	player_id: number;
	score: number;
};

export type MatchUpdate = {
	winner_id: number;
	infos: PlayerInfo[];
};

export type Lobby = {
	id: number;
	name: string;
	player_limit: number;
	player_count: number;
};

export type LobbyPlayer = {
	id: number;
	name: string;
	avatar: string;
};

export type LobbyInfo = {
	lobby_id: number;
	players: LobbyPlayer[];
}

export type LobbyCreate = {
	player_limit: number;
};

export type PlayerAction = {
	target_id: number;
	action: Action;
};
