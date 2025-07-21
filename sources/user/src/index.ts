import * as dotenv from "dotenv";
import { checkEnv } from "./env";
import path from "path";
import fs from "fs";
import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyStatic from "@fastify/static";
import fastifyMultipart from "@fastify/multipart";
import crud from "./routes/crud";
import auth from "./routes/auth";
import socket from "./routes/socket";
import { errorHandler } from "./errors/errorHandler";
import fastifyWebsocket from "@fastify/websocket";
import cors from "@fastify/cors";
import avatar from "./routes/avatar";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

checkEnv();

const app = fastify({
	https: {
		key: fs.readFileSync(
			path.resolve(__dirname, process.env.HTTPS_KEY as string)
		),
		cert: fs.readFileSync(
			path.resolve(__dirname, process.env.HTTPS_CERT as string)
		),
	},
});

app.register(fastifyStatic, {
	root: path.join(path.dirname(__dirname), "storage"),
	prefix: "/download/",
});

app.register(cors, {
	origin: process.env.FRONT_URL,
	optionsSuccessStatus: 200,
	methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
	preflightContinue: false,
});

app.register(fastifyWebsocket);

app.register(fastifyJwt, {
	secret: process.env.JWT_KEY as string,
});

app.register(fastifyMultipart);

app.register(crud, { prefix: "/crud" });

app.register(auth, { prefix: "/auth" });

app.register(socket, { prefix: "/socket" });

app.register(avatar, { prefix: "/avatar" });

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
