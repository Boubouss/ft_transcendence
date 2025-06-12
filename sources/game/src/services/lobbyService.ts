import { infos, lobbies, players, sockets } from "#routes/lobby";
import { initGameInstance } from "./matchService";
import { initTournament } from "./tournamentService";
import { Action, ClientEvent } from "#types/enums";
import axios from "axios";
import _ from "lodash";

import {
	isLobbyCreate,
	isLobbyPlayerAction,
	Lobby,
	LobbyCreate,
	LobbyInfo,
	LobbyPlayer,
	LobbyPlayerAction
} from "#types/lobby";

export const broadcastData = (data: string, except_ids?: number[]) => {
	players.forEach((player) => {
		if (except_ids?.includes(player.id)) return;

		const playerSocket = sockets.get(player.id);
		if (_.isEmpty(playerSocket)) return;

		playerSocket.send(data);
	})
}

export const emitLobbyData = (info: LobbyInfo, data: string, except_ids?: number[]) => {
	info.players.forEach((player) => {
		if (except_ids?.includes(player.id)) return;

		const playerSocket = sockets.get(player.id);
		if (_.isEmpty(playerSocket)) return;

		playerSocket.send(data);
	})
}

export const getLobbyPlayer = async (user_id: string, socket: WebSocket, token?: string) => {
	try {
		const { data } = await axios.get(
			`${process.env.API_USER}/crud/user/${user_id}`,
			{ headers: { Authorization: token } }
		)

		delete data.email;
		delete data.configuration;

		players.push(data as LobbyPlayer);
		return JSON.stringify({ event: ClientEvent.UPDATE_LOBBY_LIST, data: lobbies });
	} catch (err) {
		if (axios.isAxiosError(err)) {
			return `error: ${err.message}`;
		}

		return `unknown error: ${JSON.stringify(err)}`
	}
}

export const joinLobby = (lobby: Lobby, info: LobbyInfo, player: LobbyPlayer) => {
	if (lobby.player_limit <= info.players.length) return "error: This lobby is full.";
	info.players.push(player);
	lobby.player_count = info.players.length;

	const data = JSON.stringify({ event: ClientEvent.UPDATE_LOBBY_INFO, data: info });
	emitLobbyData(info, data);

	if (!lobby.is_tournament && lobby.player_limit === info.players.length) {
		initGameInstance(info);
	} else if (lobby.is_tournament && lobby.player_limit === info.players.length) {
		initTournament(info);
	}

	return `message: You joined lobby#${info.lobby_id}.`;
}

export const leaveLobby = (lobby: Lobby, info: LobbyInfo, playerId: number) => {
	info.players = info.players.filter((p) => p.id !== playerId);

	if (info.lobby_id === playerId) {
		destroyLobby(info);
		return `message: You left lobby#${info.lobby_id} and it got destroyed.`;
	}

	lobby.player_count = info.players.length;
	const data = JSON.stringify({ event: ClientEvent.UPDATE_LOBBY_INFO, data: info });
	emitLobbyData(info, data, [playerId]);

	return `message: You left lobby#${info.lobby_id}.`;
}

export const handleAction = (player: LobbyPlayer, data: LobbyPlayerAction) => {
	if (!isLobbyPlayerAction(data)) return "error: Expected format wasn't met.";

	const lobby = lobbies.find((l) => l.id === data.target_id);
	if (_.isEmpty(lobby)) return "error: This lobby doesn't exist.";

	const info = infos.find((i) => i.lobby_id === lobby.id);
	if (_.isEmpty(info)) return "error: Something went wrong with this lobby.";

	switch (data.action) {
		case Action.JOIN:
			return joinLobby(lobby, info, player);
		case Action.LEAVE:
			return leaveLobby(lobby, info, player.id);
		default:
			return "error: This action doesn't exist."
	}
}

export const createLobby = (player: LobbyPlayer, data: LobbyCreate) => {
	if (!isLobbyCreate(data)) return "error: Expected format wasn't met.";

	let lobby = lobbies.find((l) => l.id === player.id);
	if (!_.isEmpty(lobby)) return "error: Player already own a lobby.";

	lobby = {
		id: player.id,
		name: `${player.name}'s Lobby`,
		player_limit: data.player_limit,
		player_count: 1,
		is_tournament: data.is_tournament ?? false,
	};

	const info = {
		lobby_id: lobby.id,
		players: [player],
	}

	lobbies.push(lobby);
	infos.push(info);

	broadcastData(JSON.stringify({ event: ClientEvent.UPDATE_LOBBY_LIST, data: lobbies }));

	return JSON.stringify({ event: ClientEvent.UPDATE_LOBBY_INFO, data: info });
};

export const destroyLobby = (info: LobbyInfo) => {
	const lobbyIndex = lobbies.findIndex((l) => l.id == info.lobby_id);
	const infoIndex = infos.indexOf(info);

	lobbies.splice(lobbyIndex, 1);
	infos.splice(infoIndex, 1);

	emitLobbyData(
		info,
		JSON.stringify({
			event: ClientEvent.LOBBY_DESTROYED,
			data: { target_id: info.lobby_id }
		}),
	);

	broadcastData(JSON.stringify({ event: ClientEvent.UPDATE_LOBBY_LIST, data: lobbies }));
}
