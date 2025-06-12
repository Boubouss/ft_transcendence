export type TournamentCreate = {
	user_ids: number[];
};

export type Match = {
	players: { create: { player_id: number }[] };
};

export type Round = {
	matches: { create: Match[] };
};

export type Tournament = {
	rounds: { create: Round[] };
};
