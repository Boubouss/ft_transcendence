import {
	API_GAME_ROUTES,
	API_USER_ROUTES,
	fetchAPI,
	getStorage,
} from "#services/data.ts";
import { KeysStorage } from "#types/enums.ts";
import type { Match, Player } from "#types/match.ts";

export const getMatches = async (setMatches: (toSet: Match[]) => void) => {
	const conf = getStorage(localStorage, KeysStorage.CONFTRANS);

	const matches: Match[] = await fetchAPI(
		import.meta.env.VITE_API_GAME + API_GAME_ROUTES.MATCH + `/${conf?.id}`,
		{
			method: "GET",
			headers: { Authorization: `Bearer ` + conf?.token },
		}
	);

	//console.log(matches);

	if (matches) setMatches(matches);
};

export const getPlayers = async (
	matches: Match[] | null,
	setPlayers: (toSet: Player[]) => void
) => {
	// console.log(matches);
	if (!matches) return;

	const ids: Set<number> = new Set();
	matches.map((match) =>
		match.players.map((player) => ids.add(player.player_id))
	);

	const data = {
		ids: Array.from(ids),
	};

	const conf = getStorage(localStorage, KeysStorage.CONFTRANS);
	const players: Player[] = await fetchAPI(
		import.meta.env.VITE_API_USER + API_USER_ROUTES.CRUD_PLAYERS,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ` + conf?.token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		}
	);

	// console.log(players);
	if (players) setPlayers(players);
};
