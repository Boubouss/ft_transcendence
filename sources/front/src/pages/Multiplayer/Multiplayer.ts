import LobbyCard from "#components/Card/LobbyCard/LobbyCard.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import Button from "#components/Buttons/Button.ts";
import type { Lobby } from "#types/lobby.ts";
import List from "#components/Lists/List.ts";
import * as style from "./style";
import _ from "lodash";

import {
	createElement,
	navigateTo,
	useEffect,
	useState,
} from "#core/framework.ts";

const user_id = 1;

const Multiplayer = () => {
	const [lobbies, setLobbies] = useState<Lobby[]>([]);

	useEffect(() => {
		const socket = new WebSocket(
			`${import.meta.env.VITE_LOBBY_WSS}/${user_id}`
		);

		socket.onmessage = (event) => handleSocketMessage(event);

		return () => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.close();
			}
		};
	}, []);

	const handleSocketMessage = (event: MessageEvent) => {
		console.log(event);
	};

	const handleJoinLobby = (lobby: Lobby) => {
		navigateTo("/");
	};

	const handleLeave = () => {
		navigateTo("/");
	};

	return createElement(
		"div",
		{ id: "multiplayer", class: style.multi_background },
		createElement(
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
					children: createElement("img", {
						class: style.leave_img,
						src: "/icons/logout.png",
					}),
					attr: { class: style.leave_button, onClick: handleLeave },
				})
			),
			!_.isEmpty(lobbies)
				? List(
						{ attr: { class: style.lobby_list_container } },
						LobbyCard,
						lobbies.map((lobby) => {
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
		)
	);
};

export default Multiplayer;
