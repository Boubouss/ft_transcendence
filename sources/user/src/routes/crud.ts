import { FastifyPluginAsync } from "fastify";
import { Players, UserCreate, UserData, UserUpdate } from "../types/types";
import {
	createSchema,
	playersSchema,
	updateSchema,
} from "../validations/userSchema";
import {
	getUsers,
	createUser,
	updateUser,
	deleteUser,
	getPlayers,
	getUser,
	uploadAvatar,
} from "../services/userService";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ajv } from "..";

const crud: FastifyPluginAsync = async (fastify, opts) => {
	fastify.addHook("preHandler", authMiddleware);

	fastify.get("/users", async () => {
		return getUsers();
	});

	fastify.get("/user/:id", async (request, reply) => {
		const { id } = request.params as { id: string };
		return getUser({ id: parseInt(id) });
	});

	fastify.post("/user", { schema: createSchema }, async (request, reply) => {
		const user: UserCreate = request.body as UserCreate;
		return createUser(user);
	});

	fastify.put("/user/:id", async (request, reply) => {
		const validate = ajv.compile(updateSchema);

		try {
			const { id } = request.params as { id: string };

			const data = request.parts();
			const user: UserData = {};

			for await (const part of data) {
				if (
					part.type === "file" &&
					part.mimetype !== "application/octet-stream"
				) {
					const upload = await uploadAvatar(parseInt(id), part);
					if (!upload) return reply.send({ message: "upload ko" });
					user.avatar = upload;
				} else {
					const value = part.value as string;
					switch (part.fieldname) {
						case "name":
							if (value.length > 0) user.name = value;
							break;
						case "email":
							if (value.length > 0) user.email = value;
							break;
						case "password":
							if (value.length > 0) user.password = value;
							break;
						case "isA2F":
							user.configuration = { is2FA: value === "true" };
							break;
						default:
							break;
					}
				}
			}

			if (validate(user)) {
				const response = await updateUser(parseInt(id), user);
				return reply.send({ event: "UPDATE", data: response });
			}

			return reply.send({
				event: "ERROR",
				errors: validate.errors?.shift()?.instancePath,
			});
		} catch (error) {
			reply.send({ error });
		}
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
