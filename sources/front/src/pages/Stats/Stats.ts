import { createElement, useState, useEffect } from "#src/core/framework";
import type { Match } from "#src/types/match.ts";
import MatchCard from "#src/components/Match/MatchCard.ts";
import { getMatches } from "#src/requests/matchesRequest.ts";
import List from "#src/components/Lists/List.ts";
import NavigationBar from "#src/components/NavigationBar/NavigationBar.ts";
import { getStorage } from "#src/services/data.ts";
import { home_background } from "../Home/style";
import { wrapper } from "./style";

const testMatches: Match[] = [
	{
		id: 1,
		winner_id: 1,
		round_id: null,
		created_at: "2025-07-11T17:17:19.429Z",
		updated_at: "2025-07-11T17:17:19.429Z",
		players: [
			{ match_id: 1, player_id: 1, score: 0 },
			{ match_id: 1, player_id: 2, score: 0 },
		],
	},
	{
		id: 2,
		winner_id: null,
		round_id: null,
		created_at: "2025-07-13T13:34:07.956Z",
		updated_at: "2025-07-13T13:34:07.956Z",
		players: [
			{ match_id: 2, player_id: 1, score: 0 },
			{ match_id: 2, player_id: 2, score: 0 },
		],
	},
];

const Stats = () => {
	const [matches, setMatches] = useState<Match[] | null>(null);
	const [user, setUser] = useState<{} | null>(null);

	useEffect(() => {
		const userData = getStorage(sessionStorage, "transcendence_user");
		getMatches(setMatches);
		setUser(userData);
	}, []);

	return createElement(
		"div",
		{ class: home_background },
		NavigationBar({ userState: { user, setUser } }),
		createElement("div", {class: wrapper},
		),
		createElement("h1", null, "Historique des matchs"),
		// ...testMatches.map((m) => MatchCard(m))
		List({attr: {class: wrapper}}, MatchCard, matches ?? testMatches)
	);
};

export default Stats;
