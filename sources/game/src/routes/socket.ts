import { FastifyPluginAsync } from "fastify";
import { authMiddleware } from "../middlewares/authMiddleware";
import { SocketList, SocketMessage, Player, Lobby, User } from "../types/types";
import axios from "axios";

const socket: FastifyPluginAsync = async (fastify, opts) => {
	//fastify.addHook("preHandler", authMiddleware);

	const sockets: SocketList = {};
	const players: Player[] = [];
	const lobbies: Lobby[] = [];

	fastify.get("/lobby/:id", { websocket: true }, async (socket, request) => {
		// On open envoyer toutes les parties disponnibles
		const { id } = request.params as { id: string };
		sockets[id] = socket;
		const user: User = await axios.get(
			process.env.API_USER + process.env.GET_USER + `${id}`
		);
		const { configuration, email, ...player }: User = user;
		players.push(player);
		socket.send(JSON.stringify(lobbies));

		socket.on("message", async (message: string) => {
			const data: SocketMessage = JSON.parse(message);
			const lobby: Lobby | undefined = lobbies.find(
				(elem) => elem.owner === data.target
			);
			switch (data.action) {
				case "JOIN":
					if (!lobby) {
						const newLobby: Lobby = { owner: data.id };
					}
					break;
				case "LEAVE":
					break;
				case "READY":
					break;
				case "UNREADY":
					break;
				default:
					socket.send("404");
			}
		});

		socket.on("close", async () => {});

		return;
	});
};

export default socket;
