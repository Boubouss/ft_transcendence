import { handleTournamentLeave } from "#services/tournamentService";
import { authMiddleware } from "#middlewares/authMiddleware";
import { ClientEvent, ServerEvent } from "#types/enums";
import { Lobby, LobbyPlayer } from "#types/lobby";
import { Tournament } from "#types/tournament";
import { FastifyPluginAsync } from "fastify";
import _ from "lodash";

import {
	createLobby,
	getLobbyPlayer,
	handleAction,
	leaveLobby,
	whisperData
} from "#services/lobbyService";

export const sockets: Map<number, WebSocket> = new Map;
export const lobbies: Lobby[] = [];
export const players: LobbyPlayer[] = [];
export const tournaments: Tournament[] = [];


export const lobby: FastifyPluginAsync = async (fastify) => {
	fastify.addHook("preHandler", authMiddleware);

	fastify.get("/lobby/:user_id", { websocket: true }, async (socket, request) => {
		const { user_id } = request.params as { user_id: string };
		const player_id = parseInt(user_id);
		sockets.set(player_id, socket);

		await getLobbyPlayer(user_id, socket, request.headers.authorization);

		socket.on("message", async (message: string) => {
			const { event, data } = JSON.parse(message);

			const player = players.find((p) => p.id === player_id);
			if (_.isEmpty(player)) {
				return socket.send(JSON.stringify({
					event: ClientEvent.ERROR,
					data: { message: "This player doesn't exist." }
				}));
			}

			switch (event) {
				case ServerEvent.CREATE:
					return createLobby(player, data);
				case ServerEvent.ACTION:
					return handleAction(player, data);
				default:
					return whisperData(
						[player.id],
						JSON.stringify({
							event: ClientEvent.ERROR,
							data: { message: "This event doesn't exist." }
						})
					);
			}
		})

		socket.on("close", async () => {
			const playerIndex = players.findIndex((p) => p.id === player_id);
			if (playerIndex === -1) return;

			const lobby = lobbies.find((l) => l.id === players[playerIndex].id);
			if (!_.isEmpty(lobby)) {
				leaveLobby(lobby, players[playerIndex]);

				if (lobby.is_tournament) {
					handleTournamentLeave(players[playerIndex]);
				}
			}

			players.splice(playerIndex, 1);
			sockets.delete(player_id);
		});
	});
};

export default lobby;
