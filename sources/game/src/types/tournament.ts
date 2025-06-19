import { Player } from "@prisma/client";

export type Tournament = {
	id: number;
	players: TournamentPlayers;
}

export type TournamentPlayers = {
	inGame: Map<number, Player>;
	waiting: Map<number, Player>;
}

export type TournamentCreate = {
	user_ids: number[];
};

export type MatchQuery = {
	players: { create: { player_id: number }[] };
};

export type RoundQuery = {
	matches: { create: MatchQuery[] };
	depth: number;
};

export type TournamentQuery = {
	rounds: { create: RoundQuery[] };
};
