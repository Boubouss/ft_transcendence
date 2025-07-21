import { FastifyPluginAsync } from "fastify";
import { Players, UserCreate, UserUpdate } from "../types/types";
import {
	createSchema,
	playersSchema,
	updateSchema,
} from "../validations/userSchema";
import {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
	getPlayers,
} from "../services/userService";
import { authMiddleware } from "../middlewares/authMiddleware";

const crud: FastifyPluginAsync = async (fastify, opts) => {
	fastify.addHook("preHandler", authMiddleware);

	fastify.get("/users", async () => {
		return getUsers();
	});

	fastify.get("/user/:id", async (request, reply) => {
		const { id } = request.params as { id: string };
		return getUserById(parseInt(id));
	});

	fastify.post("/user", { schema: createSchema }, async (request, reply) => {
		const user: UserCreate = request.body as UserCreate;
		return createUser(user);
	});

	fastify.put("/user/:id", { schema: updateSchema }, async (request, reply) => {
		const { id } = request.params as { id: string };
		const user: UserUpdate = request.body as UserUpdate;
		return updateUser(parseInt(id), user);
	});

	fastify.delete("/user/:id", async (request, reply) => {
		const { id } = request.params as { id: string };
		return deleteUser(parseInt(id));
	});

	fastify.post(
		"/players",
		{ schema: playersSchema },
		async (request, reply) => {
			const { ids } = request.body as Players;
			return getPlayers(ids);
		}
	);
};

export default crud;
