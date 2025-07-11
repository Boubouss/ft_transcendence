import { createElement } from "#core/render.ts";
import { getStorage } from "#services/data.ts";
import type { Match, Player } from "#types/match.ts";
import Score from "./Score";
import { label, match_card } from "../style";
import Card from "../Card";
import { useLanguage } from "#services/language.ts";

const MatchCard = (props: { match: Match; players: Player[] }) => {
	const user = getStorage(sessionStorage, "transcendence_user");

	const { match, players } = props;

	const winner = match.winner_id;

	return Card(
		{ class: match_card },
		createElement(
			"div",
			{ class: "flex justify-between " },
			createElement(
				"span",
				{class: `uppercase`},
				winner ? (winner == user?.id ? useLanguage("win") : useLanguage("loss")) : useLanguage("ongoing")
			),
			match.round_id
				? createElement(
						"img",
						{
							class: label,
							src: "../../../../public/icons/tournament_icon.png",
						},
						"tournament"
				  )
				: createElement(
						"img",
						{ class: label, src: "../../../../public/icons/dual_icon.png" },
						"duel"
				  )
		),
		Score({ match, players, userID: user?.id })
	);
};

export default MatchCard;
