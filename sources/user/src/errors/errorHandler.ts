import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export function errorHandler(
	error: FastifyError,
	request: FastifyRequest,
	reply: FastifyReply
) {
	if (error.validation) {
		reply.status(400).send({
			statusCode: 400,
			error: "Bad Request",
			message: "Validation",
			validationErrors: error.validation,
		});
	} else if (error.code == "P2002") {
		let field = "{Unknown}";

		if (error.message.includes("email")) {
			field = "Email"
		} else if (error.message.includes("name")) {
			field = "Name"
		}

		reply.status(400).send({
			statusCode: 400,
			error: "Bad Request",
			message: `${field} already exist.`,
			validationErrors: error.validation,
		});
	} else if (error.code == "P2025") {
		reply.status(404).send({
			statusCode: 404,
			error: "Not Found",
			message: "User not found",
			validationErrors: error.validation,
		});
	} else if (error.message == "Invalid password") {
		reply.status(401).send({
			statusCode: 401,
			error: "Unauthorized",
			message: "Invalid password",
			validationErrors: error.validation,
		});
	} else {
		console.log(error.code);
		reply.send(error);
	}
}
