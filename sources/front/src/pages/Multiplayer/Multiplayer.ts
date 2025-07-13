import { createElement, useState } from "#core/framework.ts";
import LobbyCard from "./subComponents/LobbyCard";
import type { Lobby } from "#types/lobby.ts";
import * as style from "./style";
import _ from "lodash";

const Multiplayer = () => {
	const [lobbies, setLobbies] = useState<Lobby[]>([]);

	const handleJoinLobby = (lobby: Lobby) => { }

	return createElement(
		"div",
		{ id: "multiplayer", class: style.multi_background },
		createElement("div", { class: style.lobby_container },
			createElement("div", { class: style.lobby_list_container },
				...lobbies.map((lobby) => {
					return LobbyCard({ lobby, handleJoinLobby })
				}),
			),
		),
	);
};

export default Multiplayer;
