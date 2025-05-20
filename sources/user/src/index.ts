import * as dotenv from "dotenv";
import { checkEnv } from "./env";
import path from "path";
import fs from "fs";
import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import crud from "./routes/crud";
import auth from "./routes/auth";
import socket from "./routes/socket";
import { errorHandler } from "./errors/errorHandler";
import fastifyWebsocket from "@fastify/websocket";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

checkEnv();

const app = fastify({
	https: {
		key: fs.readFileSync(path.resolve(__dirname, process.env.HTTPS_KEY)),
		cert: fs.readFileSync(path.resolve(__dirname, process.env.HTTPS_CERT)),
	},
});

app.register(fastifyWebsocket);

app.register(fastifyJwt, {
	secret: process.env.JWT_KEY,
});

app.register(crud, { prefix: "/crud" });

app.register(auth, { prefix: "/auth" });

app.register(socket, { prefix: "/socket" });

app.setErrorHandler(errorHandler);

const start = async () => {
	try {
		await app.listen({ port: 3000 });
		console.log("Server is running on https://localhost:3000");
	} catch (err) {
		app.log.error(err);
		console.log(err);
		process.exit(1);
	}
};

start();
