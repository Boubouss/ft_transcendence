import { FastifyPluginAsync } from "fastify";
import { authMiddleware } from "../middlewares/authMiddleware";

const socket: FastifyPluginAsync = async (fastify, opts) => {
	fastify.addHook("preHandler", authMiddleware);

	fastify.get("/loby/:id", { websocket: true }, async (socket, request) => {
		// On open

		socket.on("message", async (message: string) => {});

		socket.on("close", async () => {});

		return;
	});
};

export default socket;
