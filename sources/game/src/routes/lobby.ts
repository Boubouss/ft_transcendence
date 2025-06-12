import { FastifyPluginAsync } from "fastify";
import { authMiddleware } from "#middlewares/authMiddleware";
import { Action, ClientEvent, ServerEvent } from "#types/enums";
import { findOrCreatePlayers } from "#services/playerService";
import { createMatch } from "#services/matchService";
import { SocketList } from "#types/general";
import axios from "axios";
import _ from "lodash";

import {
	Lobby,
	LobbyInfo,
	LobbyPlayer,
	LobbyCreate,
	LobbyPlayerAction,
	isLobbyCreate,
	isLobbyPlayerAction
} from "#types/lobby";
import { createTournament } from "#services/tournamentService";
import { Match, MatchPlayers } from "@prisma/client";

export const sockets: SocketList = {};
export const players: LobbyPlayer[] = [];

export const sendMatchInfo = async (match: Match, players: MatchPlayers[]) => {
	const requestData = {
		gameId: match.id.toString(),
		playersId: players.map((p) => p.player_id.toString()),
		scoreMax: 5,
	};

	await axios.post(
		`${process.env.API_LOGIC}/create_game`,
		requestData
	);

	players.forEach((p) => {
		sockets[p.player_id].send(JSON.stringify({
			event: ClientEvent.GAME_CREATED,
			data: {
				gameId: match.id
			}
		}));
	});
}

export const lobby: FastifyPluginAsync = async (fastify) => {
	fastify.addHook("preHandler", authMiddleware);

	const lobbies: Lobby[] = [];
	const infos: LobbyInfo[] = [];

	const broadcastData = (data: string, except_ids?: number[]) => {
		players.forEach((player) => {
			if (except_ids?.includes(player.id)) return;

			sockets[player.id].send(data);
		})
	}

	const emitLobbyData = (info: LobbyInfo, data: string, except_ids?: number[]) => {
		info.players.forEach((player) => {
			if (except_ids?.includes(player.id)) return;

			sockets[player.id].send(data);
		})
	}

	const getUser = async (user_id: string, token?: string) => {
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

	const createLobby = (player: LobbyPlayer, data: LobbyCreate) => {
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

	const destroyLobby = (info: LobbyInfo) => {
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

	const initGameInstance = async (info: LobbyInfo) => {
		try {
			const players = await findOrCreatePlayers(info.players.map((p) => p.id));
			const match = await createMatch(players);

			sendMatchInfo(match, match.players);
		} catch (err) {
			emitLobbyData(info, `error: ${JSON.stringify(err)}`);
		}
	}

	const initTournament = async (info: LobbyInfo) => {
		try {
			if (Math.log2(info.players.length) % 1 !== 0) {
				throw new Error("Player count must be a power of 2.");
			}

			const players = await findOrCreatePlayers(info.players.map((p) => p.id));
			const tournament = await createTournament(players);

			for (const match of tournament.rounds[0].matches) {
				sendMatchInfo(match, match.players);
			}
		} catch (err) {
			emitLobbyData(info, `error: ${JSON.stringify(err)}`);
		}
	}

	const joinLobby = (lobby: Lobby, info: LobbyInfo, player: LobbyPlayer) => {
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

	const leaveLobby = (lobby: Lobby, info: LobbyInfo, player: LobbyPlayer) => {
		info.players = info.players.filter((p) => p.id !== player.id);

		if (info.lobby_id === player.id) {
			destroyLobby(info);
			return `message: You left lobby#${info.lobby_id} and it got destroyed.`;
		}

		lobby.player_count = info.players.length;
		const data = JSON.stringify({ event: ClientEvent.UPDATE_LOBBY_INFO, data: info });
		emitLobbyData(info, data, [player.id]);

		return `message: You left lobby#${info.lobby_id}.`;
	}

	const handleAction = (player: LobbyPlayer, data: LobbyPlayerAction) => {
		if (!isLobbyPlayerAction(data)) return "error: Expected format wasn't met.";

		const lobby = lobbies.find((l) => l.id === data.target_id);
		if (_.isEmpty(lobby)) return "error: This lobby doesn't exist.";

		const info = infos.find((i) => i.lobby_id === lobby.id);
		if (_.isEmpty(info)) return "error: Something went wrong with this lobby.";

		switch (data.action) {
			case Action.JOIN:
				return joinLobby(lobby, info, player);
			case Action.LEAVE:
				return leaveLobby(lobby, info, player);
			default:
				return "error: This action doesn't exist."
		}
	}

	fastify.get("/lobby/:user_id", { websocket: true }, async (socket, request) => {
		const { user_id } = request.params as { user_id: string };
		const player_id = parseInt(user_id);
		sockets[player_id] = socket;

		socket.send(await getUser(user_id, request.headers.authorization));

		socket.on("message", async (message: string) => {
			const { event, data } = JSON.parse(message);

			const player = players.find((p) => p.id === player_id);
			if (_.isEmpty(player)) return socket.send("error: This player doesn't exist.");

			switch (event) {
				case ServerEvent.CREATE:
					return socket.send(createLobby(player, data));
				case ServerEvent.ACTION:
					return socket.send(handleAction(player, data));
				default:
					return socket.send("error: This event doesn't exist.")
			}
		})

		socket.on("close", async () => {
			const playerIndex = players.findIndex((p) => p.id === player_id);
			players.splice(playerIndex, 1);
			delete sockets[player_id];

			const info = infos.find((i) => i.players.find((p) => p.id === player_id));
			if (_.isEmpty(info)) return;

			const lobby = lobbies.find((l) => l.id === info.lobby_id);
			if (_.isEmpty(lobby)) return;

			leaveLobby(lobby, info, players[playerIndex]);
		});
	});
};

export default lobby;
