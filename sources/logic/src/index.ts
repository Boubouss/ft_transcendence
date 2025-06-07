import fastify from "fastify";
import websocketPlugin from "@fastify/websocket";
import { Game } from "./game/Game";
import { PlayerInput } from "./type/Type";
import { CreateGameRequestBody, DeleteGameRequestBody } from "./type/Interface";
import { GameState, HttpCode, WebSocketCode } from "./type/Enum";
import {
  schemaWebSocket,
  schemaCreateGame,
  schemaDeleteGame,
} from "./type/Schema";

//todo: remove the placeholders and constants
const PORT: number = 3000;
const FPS = 60;

let games = new Map<string, Game>();
const app = fastify();
app.register(websocketPlugin);

app.register(() => {
  app.get(
    "/ws/:gameId/:playerId",
    { schema: schemaWebSocket, websocket: true },
    (connection, request) => {
      const params = request.params as { gameId: string; playerId: string };
      const gameId = params.gameId;
      const playerId = params.playerId;
      const game = games.get(gameId);

      if (!game) {
        connection.close(WebSocketCode.UNDEFINED, `Game not found`);
        return;
      }
      if (!game.getPlayersId().has(playerId)) {
        connection.close(WebSocketCode.UNDEFINED, `Player not connected`);
        return;
      }
      if (game.getPlayersConnected().has(playerId)) {
        connection.close(WebSocketCode.UNDEFINED, `Player already connected`);
        return;
      }

      game.setPlayerConnection(playerId, connection);

      connection.on("message", (message: string) => {
        let data;
        try {
          data = JSON.parse(message) as { input?: PlayerInput };
        } catch (e) {
          //todo: send error ?
          return;
        }

        //todo: send error ?
        if (data.input === undefined) return;
        if (!["up", "down", null].includes(data.input)) return;

        game.setPlayerInput(playerId, data.input);
      });

      connection.on("close", () => {
        const game = games.get(gameId);
        if (!game) return;
        game.setPlayerConnection(playerId, null);
        //todo: delete after delay and if no player remains
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
      response.code(HttpCode.CONFLICT).send(); //todo: add a body?
      return;
    }
    games.set(String(body.gameId), new Game(body, FPS));
  },
);

app.post(
  "/delete_game",
  { schema: schemaDeleteGame },
  async (request, response) => {
    const body = request.body as DeleteGameRequestBody;
    if (!games.has(body.gameId)) {
      response.code(HttpCode.CONFLICT).send(); //todo: add a body?
      return;
    }
    games.delete(body.gameId);
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
