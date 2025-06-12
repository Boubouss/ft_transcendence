import _ from "lodash";
import { Action } from "./enums";

export type Lobby = {
	id: number;
};

export type LobbyPlayer = {
	id: number;
	name: string;
	avatar: string;
};

export type LobbyInfo = {
	lobby_id: number;
	player_limit: number;
	players: LobbyPlayer[];
}

export type LobbyCreate = {
	player_limit: number;
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
