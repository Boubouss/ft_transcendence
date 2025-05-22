import { FastifyPluginAsync } from "fastify";
import { authMiddleware } from "../middlewares/authMiddleware";
import axios from "axios";
import _ from "lodash";

import { SocketList, ActionMessage, Player, Lobby, User, LobbyAction, CreateMessage } from "../types/types";

const socket: FastifyPluginAsync = async (fastify) => {
	fastify.addHook("preHandler", authMiddleware);

	const sockets: SocketList = {};
	const players: Player[] = [];
	const lobbies: Lobby[] = [];

	fastify.get("/lobby/:player_id", { websocket: true }, async (socket, request) => {
		const { player_id } = request.params as { player_id: number };
		sockets[player_id] = socket;

		const { configuration, email, ...newPlayer }: User = await axios.get(
			process.env.API_USER as string + process.env.GET_USER as string + `/${player_id}`
		);

		players.push(newPlayer);
		socket.send(JSON.stringify(lobbies));

		socket.on("create", async (message: string) => {
			const data: CreateMessage = JSON.parse(message);
			const player = players.find((p) => p.id == data.player_id);
			if (_.isEmpty(player)) return socket.send("error: This player doesn't exist.");

			const newLobby: Lobby = {
				owner_id: player.id,
				player_limit: data.player_limit,
				players: [player],
			};

			lobbies.push(newLobby);
		});

		socket.on("action", async (message: string) => {
			const data: ActionMessage = JSON.parse(message);
			const player = players.find((p) => p.id == data.player_id);
			if (_.isEmpty(player)) return socket.send("error: This player doesn't exist.");

			const lobby = lobbies.find((elem) => elem.owner_id === data.target_id);
			if (_.isEmpty(lobby)) return socket.send("error: This lobby doesn't exist.");

			switch (data.action) {
				case LobbyAction.JOIN:
					lobby.players.push(player);
					break;
				case LobbyAction.LEAVE:
					if (lobby.owner_id == player.id) {
						const newOwner = _.first(lobby.players);
						if (_.isEmpty(newOwner)) {
							const lobbyId = lobbies.findIndex((l) => l.owner_id == player_id);
							delete lobbies[lobbyId];

							return;
						}

						lobby.owner_id = newOwner.id;
					}

					lobby.players = lobby.players.filter((p) => p.id != player.id);
					break;
				default:
					return socket.send("error: This action doesn't exist.");
			}
		});

		socket.on("close", async () => { });

		return;
	});
};

export default socket;
