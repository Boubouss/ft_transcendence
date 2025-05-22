import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { errorHandler } from "./errors/errorHandler";
import fastifyWebsocket from "@fastify/websocket";
import lobby from "./routes/lobby";
import { checkEnv } from "./env";
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config({ path: path.resolve(__dirname, "../.env") });
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

checkEnv();

const app = fastify({
	https: {
		key: fs.readFileSync(path.resolve(__dirname, process.env.HTTPS_KEY as string)),
		cert: fs.readFileSync(path.resolve(__dirname, process.env.HTTPS_CERT as string)),
	},
});

app.register(fastifyWebsocket);

app.register(fastifyJwt, {
	secret: process.env.JWT_KEY as string,
});

app.register(lobby);

app.setErrorHandler(errorHandler);

const start = async () => {
	try {
		await app.listen({ port: 3001 });
		console.log("Server is running on https://localhost:3001");
	} catch (err) {
		app.log.error(err);
		console.log(err);
		process.exit(1);
	}
};

start();
