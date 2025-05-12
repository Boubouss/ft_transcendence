import * as dotenv from "dotenv";
import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import crud from "./routes/crud";
import auth from "./routes/auth";
import { errorHandler } from "./errors/errorHandler";

dotenv.config();

const app = fastify();

app.register(crud, { prefix: "/crud" });

app.register(auth, { prefix: "/auth" });

app.register(fastifyJwt, {
	secret: process.env.JWT_KEY || "sdfqskdngjkaenfbome",
});

app.setErrorHandler(errorHandler);

const start = async () => {
	try {
		await app.listen({ port: 3000 });
		console.log("Server is running on http://localhost:3000");
	} catch (err) {
		app.log.error(err);
		console.log(err);
		process.exit(1);
	}
};

start();
