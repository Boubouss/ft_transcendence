import { FastifyPluginAsync } from "fastify";
import { User } from "../types/types";
import { createSchema, updateSchema } from "../validations/userSchema";
import {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
} from "../services/userService";

const crud: FastifyPluginAsync = async (fastify, opts) => {
	fastify.get("/users", async () => {
		return getUsers();
	});

	fastify.get("/user/:id", async (request, reply) => {
		const { id } = request.params as { id: string };
		return getUserById(parseInt(id));
	});

	fastify.post("/user", { schema: createSchema }, async (request, reply) => {
		const user: User = request.body as User;
		return createUser(user);
	});

	fastify.put("/user/:id", { schema: updateSchema }, async (request, reply) => {
		const { id } = request.params as { id: string };
		const user: User = request.body as User;
		return updateUser(parseInt(id), user);
	});

	fastify.delete("/user/:id", async (request, reply) => {
		const { id } = request.params as { id: string };
		return deleteUser(parseInt(id));
	});
};

export default crud;
