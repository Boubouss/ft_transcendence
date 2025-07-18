import { API_GAME_ROUTES, fetchAPI, getStorage } from "#src/services/data.ts";
import type { Match } from "#src/types/match.ts";

export const getMatches = async (setMatches: (toSet: Match[]) => void) => {
	const conf = getStorage(localStorage, "transcendence_conf");

	const matches: Match[] = await fetchAPI(
		import.meta.env.VITE_API_GAME + API_GAME_ROUTES.MATCH + `/${conf?.id}`,
		{
			method: "GET",
			headers: { Authorization: `Bearer ` + conf?.token },
		}
	);

	console.log(matches);

	if (matches) setMatches(matches);
};
