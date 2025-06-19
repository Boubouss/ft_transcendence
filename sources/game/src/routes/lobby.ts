import { FastifyPluginAsync } from "fastify";
import { authMiddleware } from "#middlewares/authMiddleware";
import { Lobby, LobbyInfo, LobbyPlayer } from "#types/lobby";
import { ServerEvent } from "#types/enums";
import { SocketList } from "#types/general";
import _ from "lodash";

import {
	createLobby,
	getLobbyPlayer,
	handleAction,
	leaveLobby
} from "#services/lobbyService";
import { Tournament } from "#types/tournament";

export const sockets: SocketList = {};
export const lobbies: Lobby[] = [];
export const players: LobbyPlayer[] = [];
export const tournaments: Tournament[] = [];
export const infos: LobbyInfo[] = [];


export const lobby: FastifyPluginAsync = async (fastify) => {
	fastify.addHook("preHandler", authMiddleware);

	fastify.get("/lobby/:user_id", { websocket: true }, async (socket, request) => {
		const { user_id } = request.params as { user_id: string };
		const player_id = parseInt(user_id);

		await getLobbyPlayer(user_id, socket, request.headers.authorization);

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
