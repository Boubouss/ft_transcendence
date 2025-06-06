import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { MyError } from "../types/enums";

function sendUnauthorized(reply: FastifyReply, message: string) {
	reply.status(401).send({
		statusCode: 401,
		error: "Unauthorized",
		message,
	});
}

function sendNotFound(reply: FastifyReply, message: string) {
	reply.status(404).send({
		statusCode: 404,
		error: "Not Found",
		message,
	});
}

function sendBadRequest(reply: FastifyReply, message: string) {
	reply.status(400).send({
		statusCode: 400,
		error: "Bad Request",
		message,
	});
}

export function errorHandler(
	error: FastifyError,
	request: FastifyRequest,
	reply: FastifyReply
) {
	switch (error.message) {
		case MyError.AUTH:
			return sendUnauthorized(reply, error.message);
		case MyError.USER_NOT_FOUND:
			return sendNotFound(reply, error.message);
		default:
			break;
	}

	switch (error.code) {
		case "P2002": {
			let field = "{Unknown}";

			if (error.message.includes("email")) {
				field = "Email"
			} else if (error.message.includes("name")) {
				field = "Name"
			}

			return sendBadRequest(reply, `${field} already exist.`);
		}
		default:
			break;
	}

	console.log(error.code);
	reply.send(error);
}
