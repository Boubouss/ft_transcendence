import _ from "lodash";
import { Action } from "./enums";

export type Lobby = {
	id: number;
	name: string;
	player_limit: number;
	player_count: number;
	is_tournament: boolean;
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
	is_tournament?: boolean;
};

export type LobbyPlayerAction = {
	target_id: number;
	action: Action;
};

export const isLobbyPlayerAction = (data: LobbyPlayerAction) => {
	return !_.isEmpty(data) && typeof data.target_id === "number" && typeof data.action === "string";
}

export const isLobbyCreate = (data: LobbyCreate) => {
	return !_.isEmpty(data) && typeof data.player_limit === "number";
}
