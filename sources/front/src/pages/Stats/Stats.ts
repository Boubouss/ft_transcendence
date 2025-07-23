import { createElement, useState, useEffect } from "#core/framework";
import type { Match, Player } from "#types/match.ts";
import MatchCard from "#components/Card/MatchCard/MatchCard.ts";
import { getMatches, getPlayers } from "#requests/matchesRequest.ts";
import List from "#components/Lists/List.ts";
import NavigationBar from "#components/NavigationBar/NavigationBar.ts";
import { getStorage } from "#services/data.ts";
import { home_background } from "../Home/style";
import { section_title, wrapper } from "./style";
import { useLanguage } from "#hooks/useLanguage.ts";

const testMatches: Match[] = [
	{
		id: 1,
		winner_id: 13,
		round_id: 13,
		created_at: "2025-07-11T17:17:19.429Z",
		updated_at: "2025-07-11T17:17:19.429Z",
		players: [
			{ match_id: 1, player_id: 13, score: 21 },
			{ match_id: 1, player_id: 15, score: 15 },
		],
	},
	{
		id: 2,
		winner_id: null,
		round_id: 1,
		created_at: "2025-07-13T13:34:07.956Z",
		updated_at: "2025-07-13T13:34:07.956Z",
		players: [
			{ match_id: 2, player_id: 14, score: 0 },
			{ match_id: 2, player_id: 15, score: 0 },
		],
	},
	{
		id: 3,
		winner_id: 2,
		round_id: null,
		created_at: "2025-07-13T13:34:07.956Z",
		updated_at: "2025-07-13T13:34:07.956Z",
		players: [
			{ match_id: 3, player_id: 13, score: 1 },
			{ match_id: 3, player_id: 14, score: 1 },
			{ match_id: 3, player_id: 15, score: 93 },
		],
	},
	{
		id: 4,
		winner_id: 15,
		round_id: null,
		created_at: "2025-07-13T13:34:07.956Z",
		updated_at: "2025-07-13T13:34:07.956Z",
		players: [
			{ match_id: 3, player_id: 13, score: 1 },
			{ match_id: 3, player_id: 14, score: 1 },
			{ match_id: 3, player_id: 15, score: 0 },
			{ match_id: 3, player_id: 13, score: 1 },
			{ match_id: 3, player_id: 14, score: 1 },
			{ match_id: 3, player_id: 15, score: 0 },
			{ match_id: 3, player_id: 13, score: 1 },
			{ match_id: 3, player_id: 14, score: 1 },
			{ match_id: 3, player_id: 15, score: 0 },
			{ match_id: 3, player_id: 13, score: 1 },
			{ match_id: 3, player_id: 14, score: 1 },
			{ match_id: 3, player_id: 15, score: 0 },
			{ match_id: 3, player_id: 13, score: 1 },
			{ match_id: 3, player_id: 14, score: 1 },
			{ match_id: 3, player_id: 15, score: 0 },
			{ match_id: 3, player_id: 13, score: 1 },
			{ match_id: 3, player_id: 14, score: 1 },
			{ match_id: 3, player_id: 15, score: 0 },
		],
	},
	{
		id: 5,
		winner_id: 2,
		round_id: null,
		created_at: "2025-07-13T13:34:07.956Z",
		updated_at: "2025-07-13T13:34:07.956Z",
		players: [
			{ match_id: 3, player_id: 13, score: 1 },
			{ match_id: 3, player_id: 14, score: 1 },
			{ match_id: 3, player_id: 15, score: 93 },
		],
	},
	{
		id: 6,
		winner_id: 2,
		round_id: null,
		created_at: "2025-07-13T13:34:07.956Z",
		updated_at: "2025-07-13T13:34:07.956Z",
		players: [
			{ match_id: 3, player_id: 13, score: 1 },
			{ match_id: 3, player_id: 14, score: 1 },
			{ match_id: 3, player_id: 15, score: 93 },
		],
	},
	{
		id: 7,
		winner_id: 2,
		round_id: null,
		created_at: "2025-07-13T13:34:07.956Z",
		updated_at: "2025-07-13T13:34:07.956Z",
		players: [
			{ match_id: 3, player_id: 13, score: 1 },
			{ match_id: 3, player_id: 14, score: 1 },
			{ match_id: 3, player_id: 15, score: 93 },
		],
	},
	{
		id: 8,
		winner_id: 2,
		round_id: null,
		created_at: "2025-07-13T13:34:07.956Z",
		updated_at: "2025-07-13T13:34:07.956Z",
		players: [
			{ match_id: 3, player_id: 13, score: 1 },
			{ match_id: 3, player_id: 14, score: 1 },
			{ match_id: 3, player_id: 15, score: 93 },
		],
	},
];

const Stats = () => {
	const [matches, setMatches] = useState<Match[] | null>(null);
	const [user, setUser] = useState<{} | null>(null);
	const [players, setPlayers] = useState<Player[]>([]);

	useEffect(() => {
		const userData = getStorage(sessionStorage, "transcendence_user");
		setUser(userData);
	}, []);

	useEffect(() => {
		getMatches(setMatches);
	}, []);

	useEffect(() => {
		getPlayers(matches ?? testMatches, setPlayers);
	}, [matches]);

	return createElement(
		"div",
		{ class: home_background },
		NavigationBar({ userState: { user, setUser } }),

		createElement("h1", { class: section_title }, useLanguage("history")),
		List(
			{ attr: { class: wrapper } },
			MatchCard,
			matches?.map((match) => {
				return { match, players };
			}) ??
				testMatches.map((match) => {
					return { match, players };
				})
		)
	);
};

export default Stats;
