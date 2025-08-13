import LobbyCard from "#components/Card/LobbyCard/LobbyCard.ts";
import { requestAction } from "#sockets/lobby/requests.ts";
import { Action, type Lobby } from "#types/lobby.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import Button from "#components/Buttons/Button.ts";
import { createElement } from "#core/render.ts";
import type { User } from "#types/user.ts";
import * as style from "./style";
import List from "../List";
import _ from "lodash";

type Props = {
	user: User | null;
	lobbies: Map<number, Lobby>;
	showModalState: [boolean, (value: boolean) => void];
	lobbySocket: WebSocket | null;
};

const LobbyList = ({ user, lobbies, showModalState, lobbySocket }: Props) => {
	const [, setShowModal] = showModalState;

	const handleJoinLobby = (lobbyId: number) => {
		if (_.isEmpty(user)) return console.error("Error: user is empty.");
		requestAction(lobbySocket, Action.JOIN, lobbyId);
	};

	return createElement(
		"div",
		{ class: style.lobby_container },
		createElement(
			"div",
			{ class: "flex w-full" },
			createElement(
				"h1",
				{ class: "underline text-4xl m-auto" },
				useLanguage("lobby_list")
			),
			Button({
				children: `${useLanguage("create_new_lobby")} +`,
				attr: {
					class: style.create_lobby_button,
					onClick: () => setShowModal(true),
				},
			})
		),
		!_.isEmpty(lobbies)
			? List(
					{ attr: { class: style.lobby_list_container } },
					LobbyCard,
					Array.from(lobbies).map(([_, lobby]) => {
						return { lobby, handleJoinLobby };
					})
				)
			: createElement(
					"div",
					{ class: style.lobby_list_container },
					createElement(
						"p",
						{ class: "m-auto text-3xl" },
						useLanguage("no_lobby")
					)
				)
	);
};

export default LobbyList;
