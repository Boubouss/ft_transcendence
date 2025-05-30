import { FastifyPluginAsync } from "fastify";
import { UserCreate, UserUpdate } from "../types/types";
import { createSchema, updateSchema } from "../validations/userSchema";
import { authMiddleware } from "../middlewares/authMiddleware";

import {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
} from "../services/userService";

const crud: FastifyPluginAsync = async (fastify) => {
	fastify.addHook("preHandler", authMiddleware);

	fastify.get("/users", async () => {
		return getUsers();
	});

	fastify.get("/user/:id", async (request, reply) => {
		const { id } = request.params as { id: string };

		reply.send(getUserById(parseInt(id)));
	});

	fastify.post("/user", { schema: createSchema }, async (request, reply) => {
		const user: UserCreate = request.body as UserCreate;

		reply.send(createUser(user));
	});

	fastify.put("/user/:id", { schema: updateSchema }, async (request, reply) => {
		const { id } = request.params as { id: string };
		const user: UserUpdate = request.body as UserUpdate;

		reply.send(updateUser(parseInt(id), user));
	});

	fastify.delete("/user/:id", async (request, reply) => {
		const { id } = request.params as { id: string };

		reply.send(deleteUser(parseInt(id)));
	});
};

export default crud;
