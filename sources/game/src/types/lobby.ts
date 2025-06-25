import { Action } from "./enums";
import _ from "lodash";

export type Lobby = {
	id: number;
	name: string;
	player_limit: number;
	is_tournament: boolean;
	players: LobbyPlayer[];
	ready_ids: number[];
};

export type LobbyPlayer = {
	id: number;
	name: string;
	avatar: string;
};

export type LobbyCreate = {
	player_limit: number;
	is_tournament?: boolean;
};

export type LobbyPlayerAction = {
	target_id: number;
	player_id?: number;
	action: Action;
};

export const isLobbyPlayerAction = (data: LobbyPlayerAction) => {
	return !_.isEmpty(data) && typeof data.target_id === "number" && typeof data.action === "string";
}

export const isLobbyCreate = (data: LobbyCreate) => {
	return !_.isEmpty(data) && typeof data.player_limit === "number";
}
