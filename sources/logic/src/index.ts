import fastify from "fastify";
import websocketPlugin from "@fastify/websocket";
import { Game } from "./game/Game";
import { CreateGameRequestBody, DeleteGameRequestBody } from "./type/Interface";
import { GameState, HttpCode, WebSocketCode } from "./type/Enum";
import {
  schemaCreateGame,
  schemaDeleteGame,
  schemaGetGame,
  schemaWebSocket,
  schemeWebSocketInput,
} from "./type/Schema";

//todo: remove the placeholders and constants
const FPS: 30 | 60 = 60;
const PORT: number = 3000;
const TIMEOUT_GAME_DELETION = 30; //time in second

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
      if (!game.playersId.has(playerId)) {
        connection.close(WebSocketCode.UNDEFINED, `Player not connected`);
        return;
      }
      if (game.playersConnected.has(playerId)) {
        connection.close(WebSocketCode.UNDEFINED, `Player already connected`);
        return;
      }

      game.setPlayerConnection(playerId, connection);

      connection.on("message", (message: string) => {
        let data;
        try {
          data = JSON.parse(message);
        } catch (e) {
          return;
        }
        if (schemeWebSocketInput.safeParse(data).success)
          game.setPlayerInput(playerId, data.input);
        else {
        }
      });

      connection.on("close", () => {
        const game = games.get(gameId);
        if (!game) return;
        game.setPlayerConnection(playerId, null);

        if (game.gameState !== GameState.Init && game.isEmpty()) {
          setTimeout(() => {
            const game = games.get(gameId);
            if (!game || !game.isEmpty()) return;
            game.players.forEach((player) => player.socket?.close());
            games.delete(gameId);
          }, TIMEOUT_GAME_DELETION * 1000);
        }
      });
    },
  );
});

app.get(
  "/players/:id/game",
  { schema: schemaGetGame },
  async (request, response) => {
    const params = request.params as { id: string };
    for (const [gameId, game] of games.entries())
      if (game.players.has(params.id)) return response.send({ gameId: gameId });
    response.send({ gameId: null });
  },
);

app.post("/games", { schema: schemaCreateGame }, async (request, response) => {
  const body = request.body as CreateGameRequestBody;
  if (games.has(body.gameId)) {
    response.code(HttpCode.CONFLICT).send(); //todo: add a body?
    return;
  }
  games.set(String(body.gameId), new Game(body, FPS));
});

app.delete(
  "/games",
  { schema: schemaDeleteGame },
  async (request, response) => {
    const body = request.body as DeleteGameRequestBody;
    if (!games.has(body.gameId)) {
      response.code(HttpCode.CONFLICT).send(); //todo: add a body?
      return;
    }
    games.get(body.gameId)?.players.forEach((player) => player.socket?.close());
    games.delete(body.gameId);
  },
);

app.listen({ port: PORT }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on port: ${PORT}`);
});

setInterval(() => {
  games.forEach((game, gameId) => {
    game.update();
    game.broadcast(JSON.stringify(game.toJson()));

    if (game.gameState === GameState.Over) {
      games.get(gameId)?.players.forEach((player) => player.socket?.close());
      games.delete(gameId);
    }
  });
}, 1000 / FPS);
