import { createElement } from "#core/render.ts";
import type { Match, Player } from "#types/match.ts";
import _ from "lodash";
import { list_wrapper, score_container } from "../style";
import UserCard from "../UserCard/UserCard";
import List from "#components/Lists/List.ts";
import TextCard from "../TextCard/TextCard";

const Score = (props: { match: Match; players: Player[]; userID: number }) => {
	const { match, players, userID } = props;

	const player = {
		...match.players.find((p) => p.player_id === userID),
		...players.find((p) => p.id === userID),
	};

	return createElement(
		"div",
		{ class: score_container },
		...(match.players.length !== 2
			? [
					UserCard({
						name: player?.name ?? "",
						avatar: player?.avatar ?? "",
						score: player?.score ?? 0,
					}),
					createElement("span", {}, "vs"),
					List(
						{ attr: { class: list_wrapper } },
						TextCard,
						match.players
							.filter((mp) => mp.player_id !== userID)
							.map((matchPlayer) => {
								const player = {
									...matchPlayer,
									...players.find((p) => p.id === matchPlayer.player_id),
								};

								return {
									name: player?.name,
									avatar: player?.avatar,
									score: player?.score,
								};
							})
					),
				]
			: [
					List(
						{ attr: { class: "w-full flex flex-row" } },
						UserCard,
						match.players.map((matchPlayer) => {
							const player = {
								...matchPlayer,
								...players.find((p) => p.id === matchPlayer.player_id),
							};

							return {
								name: player?.name,
								avatar: player?.avatar,
								score: player?.score,
							};
						})
					),
				])
	);
};

export default Score;
