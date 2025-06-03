import fastify from "fastify";
import websocketPlugin from "@fastify/websocket";
import { CreateGameRequestBody } from "./type/Interface";
import { Game } from "./game/Game";
import { schemaWebsocket, schemaCreateGame } from "./type/Schema";

//todo: remove the placeholders and constants
const PORT: number = 3000;
const WSCODE = 4000;
const FPS = 60;

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
        return connection.close(WSCODE, `No game with gameId: ${gameId}`);
      }
      if (!game.getPlayersId().has(playerId)) {
        return connection.close(WSCODE, `The player is not expected`);
      }
      if (game.getPlayersConnected().has(playerId)) {
        return connection.close(WSCODE, `The player is already connected`);
      }
      game.setPlayerConnection(playerId, connection);

      connection.on("message", (message: string) => {
        let data;
        try {
          data = JSON.parse(message) as { input?: string };
        } catch (e) {
          return;
        }

        //todo: send an error message as JSON?
        if (typeof data !== "object") return;
        if (data.input !== "up" && data.input !== "down" && data.input !== null)
          return;
        console.log(data);

        game.setPlayerInput(playerId, data.input);
      });

      connection.on("close", () => {
        games.get(gameId)?.setPlayerConnection(playerId, null);
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
      return;
    }
    games.set(String(body.gameId), new Game(body, FPS));
  },
);

app.listen({ port: PORT }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listenning on port: ${PORT}`);
});

setInterval(() => {
  games.forEach((game) => {
    game.update();
    game.broadcast(JSON.stringify(game.toJson()));
  });
}, 1000 / 60);
