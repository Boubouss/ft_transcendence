import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";

interface FastifyRequestWithQuery extends FastifyRequest {
	query: {
		token?: string;
	};
}

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
	token: string,
	api: FastifyInstance
) => {
	try {
		api.jwt.verify(token);
	} catch (err) {
		return false;
	}
};
