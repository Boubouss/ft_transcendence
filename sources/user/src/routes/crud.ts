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
			// const user: UserUpdate = request.body as UserUpdate;

			const data = request.parts();
			const user: UserData = {};
			// console.log(request);

			for await (const part of data) {
				// console.log(part);
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
							user.configuration = { is2FA: true };
							break;
						default:
							break;
					}
				}
			}

			console.log(user);

			if (validate(user)) return updateUser(parseInt(id), user);
			else console.log("nop");

			console.log("fin boucle");
		} catch (error) {
			reply.send({ message: error });
		}

		// return updateUser(parseInt(id), user);
		reply.send({ message: "ok" });
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
