import fastify from "fastify";
// import ws from "ws";

const app = fastify();
const port: number = 3000;

app.get("/", async (request, reply) => {
  return "hello world\n";
});

app.listen({ port: port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${port}`);
});
