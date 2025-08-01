import cors from "@fastify/cors";
import fastify from "fastify";
import websocketPlugin from "@fastify/websocket";
import { CreateGameRequestBody, DeleteGameRequestBody } from "./type/Interface";
import { Game } from "./game/Game";
import { GameState, HttpCode, WebSocketCode } from "./type/Enum";
import {
  schemaCreateGame,
  schemaDeleteGame,
  schemaGetGame,
  schemaWebSocket,
  schemaWebSocketInput,
} from "./type/Schema";

//todo: remove the placeholders and constants
const FPS: 30 | 60 = 60;
const PORT: number = 3001;
const TIMEOUT_GAME_DELETION = 30; //time in second

let games = new Map<string, Game>();
const app = fastify();
app.register(websocketPlugin);
app.register(cors, {
  origin: "http://localhost:5173", //todo:replace the hardcoded value
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  preflightContinue: false,
});

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
        connection.close(WebSocketCode.UNDEFINED, `Player not expected`);
        return;
      }
      if (game.playersConnected.has(playerId)) {
        connection.close(WebSocketCode.UNDEFINED, `Player already connected`);
        return;
      }

      game.setPlayerConnection(playerId, connection);
      if (game.gameState !== GameState.Init)
        game.setPlayerPause(playerId, "pause");

      connection.on("message", (message: string) => {
        try {
          const data = JSON.parse(message);
          schemaWebSocketInput.parse(data);

          if (data.type === "input") {
            game.setPlayerInput(playerId, data.value);
          } else if (data.type === "pause") {
            game.setPlayerPause(playerId, data.value);
          }
        } catch (e) {
          return;
        }
      });

      connection.on("close", () => {
        const game = games.get(gameId);
        if (!game) return;
        game.setPlayerConnection(playerId, null);
        game.setPlayerInput(playerId, null);

        if (game.gameState !== GameState.Init && game.isEmpty()) {
          setTimeout(() => {
            const game = games.get(gameId);
            if (!game || !game.isEmpty()) return;
            game.players.forEach((player) => player.socket?.close());
            games.delete(gameId);
            //todo: make a request to the game API, inside a try catch
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

function isLocalGameOver(game: Game, gameId: string) {
  if (game.gameState === GameState.Init) return false;
  if (!gameId.match("local-.*")) return false;
  if (game.playersConnected.size === game.players.size) return false;
  return true;
}

function mainLoop() {
  games.forEach((game, gameId) => {
    game.update();
    game.broadcast(JSON.stringify(game.toJson()));

    if (isLocalGameOver(game, gameId)) {
      game.players.forEach((p) => p.socket?.close());
      games.delete(gameId);
    }

    if (game.gameState === GameState.Over) {
      game.players.forEach((p) => p.socket?.close());
      games.delete(gameId);
      //todo: make a request to the game API, inside a try catch
    }
  });
  setTimeout(mainLoop, 1000 / FPS);
}
mainLoop();
