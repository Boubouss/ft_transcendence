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

app.register(() => {
  app.get(
    "/ws/:gameId/:playerId",
    { schema: schemaWebsocket, websocket: true },
    (connection, request) => {
      const params = request.params as { gameId: string; playerId: string };
      const gameId = params.gameId;
      const playerId = params.playerId;
      const game = games.get(gameId);

      if (!game) {
        return connection.close(wsCode, `No game with gameId: ${gameId}`);
      }
      if (!game.getPlayersExpected().has(playerId)) {
        return connection.close(wsCode, `The player is not expected`);
      }
      if (game.getPlayersConnected().has(playerId)) {
        return connection.close(wsCode, `The player is already connected`);
      }
      game.addPlayer(playerId);

      connection.on("message", (message) => {
        console.log(`${message}`);
      });

      connection.on("close", () => {
        games.get(gameId)?.delPlayer(playerId);
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

// debug
setInterval(() => {
  console.log(games);
}, 5000);
