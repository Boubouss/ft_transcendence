import { createElement, navigateTo, useEffect, useState } from "#core/framework.ts";
import LobbyCard from "./subComponents/LobbyCard";
import type { Lobby } from "#types/lobby.ts";
import * as style from "./style";
import _ from "lodash";
import List from "#components/Lists/List.ts";

const user_id = 1;

const Multiplayer = () => {
	// const [lobbies, setLobbies] = useState<Lobby[]>([]);
	const lobbies: Lobby[] = [
		{ id: 1, name: "Test 1", player_limit: 2, is_tournament: true, players: [], ready_ids: [] },
		{ id: 2, name: "Test 2", player_limit: 2, is_tournament: false, players: [], ready_ids: [] },
		{ id: 3, name: "Test 3", player_limit: 2, is_tournament: false, players: [], ready_ids: [] },
		{ id: 4, name: "Test 4", player_limit: 2, is_tournament: true, players: [], ready_ids: [] },
		{ id: 5, name: "Test 5", player_limit: 2, is_tournament: false, players: [], ready_ids: [] },
		{ id: 6, name: "Test 6", player_limit: 2, is_tournament: false, players: [], ready_ids: [] },
		{ id: 7, name: "Test 7", player_limit: 2, is_tournament: false, players: [], ready_ids: [] },
		{ id: 8, name: "Test 8", player_limit: 2, is_tournament: false, players: [], ready_ids: [] },
		{ id: 9, name: "Test 9", player_limit: 2, is_tournament: false, players: [], ready_ids: [] },
	]

	useEffect(() => {
		const socket = new WebSocket(`${import.meta.env.VITE_LOBBY_WSS}/${user_id}`);

		return () => {
			console.log(true);
		}
	}, [])

	const handleJoinLobby = (lobby: Lobby) => {
		navigateTo("/");
	}

	return createElement(
		"div",
		{ id: "multiplayer", class: style.multi_background },
		createElement("div", { class: style.lobby_container },
			List(
				{ attr: { class: style.lobby_list_container } },
				LobbyCard,
				lobbies.map((lobby) => {
					return { lobby, handleJoinLobby }
				})
			)
		),
	);
};

export default Multiplayer;
