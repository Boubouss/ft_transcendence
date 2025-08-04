import { handleTournamentLeave } from "#services/tournamentService";
import { handlePlayerInstance } from "#services/playerService";
import { Instance, Lobby, LobbyPlayer } from "#types/lobby";
import { ClientEvent, ServerEvent } from "#types/enums";
import { Tournament } from "#types/tournament";
import { FastifyPluginAsync } from "fastify";
import _ from "lodash";

import {
  createLobby,
  getLobbyPlayer,
  handleAction,
  leaveLobby,
  whisperData,
} from "#services/lobbyService";

export const sockets: Map<number, WebSocket> = new Map();
export const lobbies: Lobby[] = [];
export const players: LobbyPlayer[] = [];
export const playerInstance: Map<number, Instance> = new Map();
export const tournaments: Map<number, Tournament> = new Map();

const playerTimeout: Map<number, ReturnType<typeof setTimeout>> = new Map();

export const lobby: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/lobby/:user_id",
    { websocket: true },
    async (socket, request) => {
      const { user_id } = request.params as { user_id: string };
      const player_id = parseInt(user_id);
      sockets.set(player_id, socket);

      if (_.isEmpty(players.find((p) => p.id === player_id))) {
        await getLobbyPlayer(
          user_id,
          socket,
          request.headers["sec-websocket-protocol"],
        );
      } else {
        const timeout = playerTimeout.get(player_id);

        clearTimeout(timeout);

        socket.send(
          JSON.stringify({ event: ClientEvent.LOBBY_LIST, data: lobbies }),
        );

        const currentLobby = lobbies.find((lobby) => {
          const player = lobby.players.find((p) => {
            return p.id === player_id;
          });

          return !_.isEmpty(player);
        });

        if (!_.isEmpty(currentLobby)) {
          socket.send(
            JSON.stringify({
              event: ClientEvent.JOINED,
              data: { target_id: currentLobby.id },
            }),
          );

          handlePlayerInstance(player_id);
        }
      }

      socket.on("message", async (message: string) => {
        const { event, data } = JSON.parse(message);

        const player = players.find((p) => p.id === player_id);
        if (_.isEmpty(player)) {
          return socket.send(
            JSON.stringify({
              event: ClientEvent.ERROR,
              data: { message: "resource_not_found" },
            }),
          );
        }

        switch (event) {
          case ServerEvent.CREATE:
            return createLobby(player, data);
          case ServerEvent.ACTION:
            return handleAction(player, data);
          default:
            return whisperData(
              [player.id],
              JSON.stringify({
                event: ClientEvent.ERROR,
                data: { message: "This event doesn't exist." },
              }),
            );
        }
      });

      socket.on("close", async () => {
        const timeout = setTimeout(() => {
          const playerIndex = players.findIndex((p) => p.id === player_id);
          if (playerIndex === -1) return;

          const lobby = lobbies.find((lobby) => {
            const player = lobby.players.find((p) => {
              return p.id === players[playerIndex].id;
            });

            return !_.isEmpty(player);
          });

          if (!_.isEmpty(lobby)) {
            leaveLobby(lobby, players[playerIndex]);

            if (lobby.is_tournament) {
              handleTournamentLeave(players[playerIndex]);
            }
          }

          players.splice(playerIndex, 1);
          sockets.delete(player_id);
        }, 15000);

        playerTimeout.set(player_id, timeout);
      });
    },
  );
};

export default lobby;
