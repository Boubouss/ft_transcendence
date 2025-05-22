import { FastifyPluginAsync } from "fastify";
import { authMiddleware } from "../middlewares/authMiddleware";
import { SocketList, Player, Lobby, User } from "../types/types";
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

		socket.on("message", async (message: string) => {});

		socket.on("close", async () => {});

		return;
	});
};

export default socket;
