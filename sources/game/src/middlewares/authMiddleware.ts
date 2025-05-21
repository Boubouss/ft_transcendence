import { FastifyRequest, FastifyReply } from "fastify";

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
