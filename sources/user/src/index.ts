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
import Ajv from "ajv";
import ajvFormats from "ajv-formats";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

checkEnv();

export const ajv = new Ajv();
ajvFormats(ajv);

const app = fastify({
	https: {
		key: fs.readFileSync(process.env.HTTPS_KEY as string),
		cert: fs.readFileSync(process.env.HTTPS_CERT as string),
	},
});

app.register(fastifyStatic, {
	root: path.join(path.dirname(__dirname), "storage"),
	prefix: "/api/user/download/",
	setHeaders: (res, path, stat) => {
		res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
		res.setHeader("Pragma", "no-cache");
		res.setHeader("Expires", "0");
	},
});

app.register(cors, {
	origin: "*",
	optionsSuccessStatus: 200,
	methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
	preflightContinue: false,
});

app.register(fastifyWebsocket);

app.register(fastifyJwt, {
	secret: process.env.JWT_KEY as string,
});

app.register(fastifyMultipart);

app.register(crud, { prefix: "/api/user/crud" });

app.register(auth, { prefix: "/api/user/auth" });

app.register(socket, { prefix: "/api/user/socket" });

app.setErrorHandler(errorHandler);

app.get("/api/user/ping", () => {
	return "pong";
});

const start = async () => {
	try {
		await app.listen({ port: 3000, host: "0.0.0.0" });
		console.log("Server is running on ", process.env.API_USER);
	} catch (err) {
		app.log.error(err);
		console.log(err);
		process.exit(1);
	}
};

start();
