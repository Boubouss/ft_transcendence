import fastify from "fastify";
import websocketPlugin from "@fastify/websocket";
import { schemaWebsocket, schemaCreateGame } from "./Schema";
import { CreateGameRequestBody, Game } from "./Game";

// tmp
const port: number = 3000; // should not be hardcoded
const wsCode = 4000; // placeholder

let games = new Map<string, Game>();
const app = fastify();
app.register(websocketPlugin);
app.register(require("fastify-qs"));

app.register(() => {
  app.get(
    "/ws",
    { schema: schemaWebsocket, websocket: true },
    (connection, request) => {
      const query = request.query as { gameId: string; playerId: string };

      const game = games.get(query.gameId);

      if (!game) {
        connection.close(wsCode, `No game with gameId: ${query.gameId}`);
        return;
      }
      if (!game.getPlayersExpected().has(query.playerId)) {
        connection.close(wsCode, `The player is not expected to this game`);
        return;
      }
      if (game.getPlayersConnected().has(query.playerId)) {
        connection.close(wsCode, `The player is already connected to the game`);
        return;
      }

      // check if the player is already connected in a game?

      game.addPlayer(query.playerId);

      connection.on("message", (message) => {
        console.log(`${message}`);
      });

      connection.on("close", () => {
        games.get(query.gameId)?.delPlayer(query.playerId);
        console.log("websocket deconnected");
      });
    },
  );
});

app.post(
  "/create_game",
  { schema: schemaCreateGame },
  async (request, response) => {
    const body = request.body as CreateGameRequestBody;
    if (games.has(body.gameId)) {
      response.code(403).send();
      console.log("the game already exist");
      return;
    }
    // check if the player is already expected in a game?
    games.set(String(body.gameId), new Game(body));
  },
);

app.listen({ port: port }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on port: ${port}`); // debug
});

setInterval(() => {
  games.forEach((game) => {
    game.update();
  });
}, 1000 / 60);

setInterval(() => {
  console.log(games);
}, 5000);
