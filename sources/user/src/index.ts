import fastify from "fastify";
//import userRoutes from "./routes/userRoutes";
//import myPlugin from "./plugins/myPlugin";

const app = fastify();

// Enregistrer les plugins
//app.register(myPlugin);

// Enregistrer les routes
//app.register(userRoutes, { prefix: "/users" });

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
