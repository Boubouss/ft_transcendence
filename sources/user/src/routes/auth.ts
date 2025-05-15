import { FastifyPluginAsync } from "fastify";
import { User, Credential, Credential2FA, UserCreate, UserAuth } from "../types/types";
import { createSchema, authSchema, auth2FASchema } from "../validations/userSchema";
import { createUser } from "../services/userService";
import { authUser, getUserAuth, updateConfig, generate2FA } from "../services/authService";

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
		const { email, password } = request.body as Credential;
		const user: UserAuth = await getUserAuth(email) as UserAuth;
		if (!user) throw Error("Pas trouve =(");
		const check: boolean = await authUser(password, user);
		if (!check) throw new Error("Invalid password");
		if (user.configuration.is2FA) {
			await generate2FA(user);
			return { user };
		}
		const token: string = fastify.jwt.sign({ email: user.email });
		return { ...user, token };
	});

	fastify.post("/2FA", { schema: auth2FASchema }, async (request, reply) => {
		const { code, email } = request.body as Credential2FA;
		const user: UserAuth = await getUserAuth(email) as UserAuth;
		if (code === user.configuration.code2FA) {
			const token: string = fastify.jwt.sign({ email: user.email });
			user.configuration.code2FA = "";
			await updateConfig(user.configuration);
			return { user, token };
		} else {
			reply.status(403).send({ message: "Invalid 2FA code" });
		}
	});
};

export default auth;
