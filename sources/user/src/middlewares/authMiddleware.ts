import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";

export const authMiddleware = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	try {
		await request.jwtVerify();
	} catch (err) {
		reply.send(err);
	}
};

export const socketAuthMiddleware = async (
	token: string | undefined,
	api: FastifyInstance
) => {
	try {
		if (!token) return false;
		api.jwt.verify(token);
		return true;
	} catch (err) {
		return false;
	}
};
