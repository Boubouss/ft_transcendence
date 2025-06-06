import { FastifyPluginAsync } from "fastify";
import { User, UserCreate, UserUpdate } from "../types/types";
import { createSchema, updateSchema } from "../validations/userSchema";
import { authMiddleware } from "../middlewares/authMiddleware";
import { MyError } from "../types/enums";
import _ from "lodash";

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
		return await getUsers();
	});

	fastify.get("/user/:id", async (request, reply) => {
		const { id } = request.params as { id: string };
		const user = await getUserById(parseInt(id));
		if (_.isEmpty(user)) throw new Error(MyError.USER_NOT_FOUND);

		reply.send(user);
	});

	fastify.post("/user", { schema: createSchema }, async (request, reply) => {
		const userData: UserCreate = request.body as UserCreate;
		const user: User = await createUser(userData);
		if (!user) throw new Error("Fail to register user");

		reply.send(user);
	});

	fastify.put("/user/:id", { schema: updateSchema }, async (request, reply) => {
		const { id } = request.params as { id: string };
		const user: UserUpdate = request.body as UserUpdate;

		reply.send(await updateUser(parseInt(id), user));
	});

	fastify.delete("/user/:id", async (request, reply) => {
		const { id } = request.params as { id: string };

		reply.send(await deleteUser(parseInt(id)));
	});
};

export default crud;
