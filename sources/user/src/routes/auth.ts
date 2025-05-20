import { FastifyPluginAsync } from "fastify";
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
import { createUser, getUserById } from "../services/userService";
import {
	authUser,
	getUserAuth,
	updateConfig,
	generate2FA,
} from "../services/authService";

const auth: FastifyPluginAsync = async (fastify, opts) => {
	fastify.post(
		"/register",
		{ schema: createSchema },
		async (request, reply) => {
			const userData: UserCreate = request.body as UserCreate;
			const user: User = await createUser(userData);
			if (!user) throw new Error("Fail to register user");
			const token: string = fastify.jwt.sign({ email: user.email });
			return { ...user, token };
		}
	);

	fastify.post("/login", { schema: authSchema }, async (request, reply) => {
		const { username, password } = request.body as Credential;
		const userAuth: UserAuth = (await getUserAuth(username)) as UserAuth;
		if (!userAuth) throw Error("Pas trouve =(");
		const check: boolean = await authUser(password, userAuth);
		if (!check) throw new Error("Invalid password");
		const user: User = await getUserById(userAuth.id);
		if (userAuth.configuration.is2FA) {
			await generate2FA(userAuth);
			return { ...user };
		}
		const token: string = fastify.jwt.sign({ email: user.email });
		return { ...user, token };
	});

	fastify.post("/2FA", { schema: auth2FASchema }, async (request, reply) => {
		const { code, username } = request.body as Credential2FA;
		const userAuth: UserAuth = (await getUserAuth(username)) as UserAuth;
		if (code === userAuth.configuration.code2FA) {
			const token: string = fastify.jwt.sign({ email: userAuth.email });
			userAuth.configuration.code2FA = "";
			await updateConfig(userAuth.configuration);
			const user: User = await getUserById(userAuth.id);
			return { ...user, token };
		} else {
			reply.status(403).send({ message: "Invalid 2FA code" });
		}
	});
};

export default auth;
