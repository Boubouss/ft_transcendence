import { createElement } from "#src/core/render.ts";
import { getStorage } from "#src/services/data.ts";
import type { Match } from "#src/types/match.ts";
import { label, match_card, score } from "./style";

const MatchCard = (match: Match) => {
	const user = getStorage(sessionStorage, "transcendence_user");

	const winner = match.winner_id;
	const duel = match.players.length > 2;

	return createElement(
		"div",
		{ class: match_card },
		createElement(
			"div",
			{ class: "flex justify-between" },
			createElement("h2", {}, `Match ${match.id}`),
			match.round_id
				? createElement("span", { class: label }, "tournament")
				: createElement("span", { class: label }, "normal")
		),
		createElement(
			"span",
			{},
			winner ? (winner == user?.id ? "WON" : "LOST") : "en cours"
		),
		createElement(
			"span",
			{ class: score },
			duel
				? `${match.players[0].score} - ${match.players[1].score}`
				: `${match.players[user?.id]?.score} points scored`
		)
	);
};

export default MatchCard;
