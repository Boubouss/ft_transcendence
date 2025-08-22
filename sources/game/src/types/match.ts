import { LobbyPlayer } from "./lobby";

export type MatchCreate = {
	user_ids: number[];
};

export type MatchUpdate = {
	winner_id: number;
	infos: MatchPlayerInfo[];
};

export type MatchPlayerInfo = {
	player_id: number;
	score: number;
};
