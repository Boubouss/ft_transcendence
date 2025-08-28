import cors from "@fastify/cors";
import fastify from "fastify";
import websocketPlugin from "@fastify/websocket";
import { CreateGameRequestBody, DeleteGameRequestBody } from "./type/Interface";
import { Game } from "./game/Game";
import { GameState, HttpCode, WebSocketCode } from "./type/Enum";
import { PlayerScore } from "./type/Type";
import { requestGameDelete, requestGameEnd } from "./services/gameService";
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";

import {
  schemaCreateGame,
  schemaDeleteGame,
  schemaGetGame,
  schemaWebSocket,
  schemaWebSocketInput,
} from "./type/Schema";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

//todo: remove the placeholders and constants
const FPS: 30 | 60 = 60;
const PORT: number = 3002;
const playerTimeout: Map<string, ReturnType<typeof setTimeout>> = new Map();
export const gameTimeout: Map<
  string,
  ReturnType<typeof setTimeout>
> = new Map();

let games = new Map<string, Game>();

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const app = fastify({
  https: {
    key: fs.readFileSync(
      path.resolve(__dirname, process.env.HTTPS_KEY as string)
    ),
    cert: fs.readFileSync(
      path.resolve(__dirname, process.env.HTTPS_CERT as string)
    ),
  },
});

app.register(websocketPlugin);
app.register(cors, {
  origin: process.env.FRONT_URL,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  preflightContinue: false,
});

app.register(async () => {
  app.get(
    "/ws/:gameId/:playerId",
    { schema: schemaWebSocket, websocket: true },
    (connection, request) => {
      const params = request.params as { gameId: string; playerId: string };
      const gameId = params.gameId;
      const playerId = params.playerId;
      const game = games.get(gameId);

      if (playerTimeout.has(playerId)) {
        const timeout = playerTimeout.get(playerId);
        clearTimeout(timeout);
      }

      if (!game) {
        connection.close(WebSocketCode.UNDEFINED, `Game not found`);
        return;
      }
      if (!game.playersId.has(playerId)) {
        connection.close(WebSocketCode.UNDEFINED, `Player not expected`);
        return;
      }

      game.setPlayerConnection(playerId, connection);

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

        const timeout = setTimeout(() => {
          const game = games.get(gameId);
          if (!game) return;

          const players = [...game.playersConnected.values()];
          if (players.length === 1) {
            game.setWinnerId(parseInt(players[0]));
          }
        }, 10000);

        playerTimeout.set(playerId, timeout);
      });
    }
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
  }
);

app.post("/games", { schema: schemaCreateGame }, async (request, response) => {
  const body = request.body as CreateGameRequestBody;
  if (games.has(body.gameId)) {
    response.code(HttpCode.CONFLICT).send(); //todo: add a body?
    return;
  }

  games.set(String(body.gameId), new Game(body, FPS));

  const timeout = setTimeout(() => {
    const game = games.get(body.gameId);
    if (!game) return;

    requestGameDelete(body.gameId);

    games.get(body.gameId)?.players.forEach((player) => player.socket?.close());
    games.delete(body.gameId);
  }, 10000);

  gameTimeout.set(body.gameId, timeout);
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
  }
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
      return;
    }

    if (game.gameState === GameState.Over) {
      const playerScores: PlayerScore[] = [];

      for (const player of game.players.values()) {
        playerScores.push({
          player_id: parseInt(player.id),
          score: player.point,
        });
      }

      requestGameEnd(gameId, game.winnerId, playerScores);
      games.get(gameId)?.players.forEach((player) => player.socket?.close());
      games.delete(gameId);
    }
  });
  setTimeout(mainLoop, 1000 / FPS);
}
mainLoop();
