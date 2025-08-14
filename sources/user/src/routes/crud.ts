import { FastifyPluginAsync } from "fastify";
import { Players, UserData } from "../types/types";
import {
	createSchema,
	playersSchema,
	updateSchema,
} from "../validations/userSchema";
import {
	updateUser,
	deleteUser,
	getPlayers,
	getUser,
	uploadAvatar,
} from "../services/userService";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ajv } from "..";
import { checkRight } from "../services/authService";

const crud: FastifyPluginAsync = async (fastify, opts) => {
	fastify.addHook("preHandler", authMiddleware);

	fastify.get("/user/:id", async (request, reply) => {
		const { id } = request.params as { id: string };
		const ok = await checkRight(
			parseInt(id),
			request.headers.authorization ?? ""
		);
		if (!ok)
			return reply.send({
				event: "ERROR",
				error: "You cannot do this =(",
			});
		return getUser({ id: parseInt(id) });
	});

	fastify.put("/user/:id", async (request, reply) => {
		const { id } = request.params as { id: string };

		const ok = await checkRight(
			parseInt(id),
			request.headers.authorization ?? ""
		);
		if (!ok)
			return reply.send({
				event: "ERROR",
				error: "You cannot do this =(",
			});

		const validate = ajv.compile(updateSchema);

		try {
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
						case "is2FA":
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
		const ok = await checkRight(
			parseInt(id),
			request.headers.authorization ?? ""
		);
		if (!ok)
			return reply.send({
				event: "ERROR",
				error: "You cannot do this =(",
			});
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
