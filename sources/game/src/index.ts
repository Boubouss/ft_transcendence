import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { errorHandler } from "./errors/errorHandler";
import fastifyWebsocket from "@fastify/websocket";
import tournament from "#routes/tournament";
import match from "#routes/match";
import lobby from "#routes/lobby";
import { checkEnv } from "./env";
import * as dotenv from "dotenv";
import cors from "@fastify/cors";
import fs from "fs";

dotenv.config({ path: ".env" });
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

checkEnv();

const app = fastify({
  https: {
    key: fs.readFileSync(process.env.HTTPS_KEY as string),
    cert: fs.readFileSync(process.env.HTTPS_CERT as string),
  },
});

app.register(cors, {
  origin: process.env.FRONT_URL as string,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  preflightContinue: false,
});

app.register(fastifyWebsocket);
app.register(fastifyJwt, { secret: process.env.JWT_KEY as string });

app.register(tournament);
app.register(match);
app.register(lobby);

app.setErrorHandler(errorHandler);

const start = async () => {
  try {
    await app.listen({ port: 3001 });
    console.log("Server is running on ", process.env.API_GAME);
  } catch (err) {
    app.log.error(err);
    console.log(err);
    process.exit(1);
  }
};

start();
