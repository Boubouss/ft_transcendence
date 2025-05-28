import { FastifyPluginAsync } from "fastify";
import { createUser, getUserById } from "../services/userService";

import {
	User,
	Credential,
	Credential2FA,
	UserCreate,
	UserAuth,
} from "../types/types";

import {
	createSchema,
	authSchema,
	auth2FASchema,
} from "../validations/userSchema";

import {
	authUser,
	getUserAuth,
	updateConfig,
	generate2FA,
} from "../services/authService";

const auth: FastifyPluginAsync = async (fastify) => {
	fastify.post(
		"/register",
		{ schema: createSchema },
		async (request, reply) => {
			const userData: UserCreate = request.body as UserCreate;
			const user: User = await createUser(userData);
			if (!user) throw new Error("Fail to register user");

			reply.send({ ...user, token: fastify.jwt.sign({ email: user.email }) });
		}
	);

	fastify.post("/login", { schema: authSchema }, async (request, reply) => {
		const { name, password } = request.body as Credential;
		const userAuth: UserAuth = (await getUserAuth(name)) as UserAuth;
		if (!userAuth) throw Error("Pas trouve =(");

		const check: boolean = await authUser(password, userAuth);
		if (!check) throw new Error("Invalid password");

		const user = await getUserById(userAuth.id);
		if (!user) throw new Error("Couldn't find user.");

		if (userAuth.configuration.is2FA) {
			await generate2FA(userAuth);
			reply.send({ ...user });
			return;
		}

		reply.send({ ...user, token: fastify.jwt.sign({ email: user.email }) });
	});

	fastify.post("/2FA", { schema: auth2FASchema }, async (request, reply) => {
		const { code, name } = request.body as Credential2FA;
		const userAuth: UserAuth = (await getUserAuth(name)) as UserAuth;

		if (code === userAuth.configuration.code2FA) {
			userAuth.configuration.code2FA = "";
			await updateConfig(userAuth.configuration);

			const user = await getUserById(userAuth.id);

			reply.send({ ...user, token: fastify.jwt.sign({ email: userAuth.email }) });
			return;
		}

		reply.status(403).send({ message: "Invalid 2FA code" });
	});
};

export default auth;
