import fastify from "fastify";
import crud from "./routes/crud";
import { errorHandler } from "./errors/errorHandler";

const app = fastify();

app.register(crud, { prefix: "/crud" });

app.setErrorHandler(errorHandler);

const start = async () => {
	try {
		await app.listen({ port: 3000 });
		console.log("Server is running on http://localhost:3000");
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

start();
