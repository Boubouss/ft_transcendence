import { FastifyPluginAsync } from "fastify";
import { matchCreateSchema, matchUpdateSchema } from "#validations/matchSchema";
import { handleTournamentMatch } from "#services/tournamentService";
import { MatchCreate, MatchUpdate } from "#types/match";
import { whisperData } from "#services/lobbyService";
import { ClientEvent } from "#types/enums";
import { playerInstance, players } from "./lobby";
import _ from "lodash";

import {
  findOrCreatePlayer,
  findOrCreatePlayers,
} from "#services/playerService";

import {
  createMatch,
  deleteMatch,
  getPlayerMatches,
  updateMatch,
} from "#services/matchService";
import { LobbyPlayer } from "#types/lobby";

const match: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get("/match/:userId", async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const player = await findOrCreatePlayer(parseInt(userId));
    const matches = await getPlayerMatches(player.id);

    return reply.send(matches);
  });

  fastify.post(
    "/match/start",
    { schema: matchCreateSchema },
    async (request, reply) => {
      const data = request.body as MatchCreate;
      const players = await findOrCreatePlayers(data.user_ids);
      const match = await createMatch(players);

      return reply.send(match);
    },
  );

  fastify.put(
    "/match/end/:id",
    { schema: matchUpdateSchema },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const match = await updateMatch(
        parseInt(id),
        request.body as MatchUpdate,
      );

      const lobbyPlayers: LobbyPlayer[] = [];
      for (const matchPlayer of match.players) {
        const player = players.find((p) => p.id === matchPlayer.player_id);
        if (!_.isEmpty(player)) {
          lobbyPlayers.push(player);
        }

        playerInstance.delete(matchPlayer.player_id);
      }

      if (!match.round) {
        whisperData(
          lobbyPlayers.map((p) => p.id),
          JSON.stringify({
            event: ClientEvent.GAME_RESULT,
            data: { match, players },
          }),
        );
      }

      if (!_.isEmpty(match) && !_.isEmpty(match.round)) {
        match.players = match.players.filter((p) => {
          return p.player_id !== match.winner_id;
        });

        await handleTournamentMatch(match, match.round, _.first(match.players));
      }

      return reply.send(match);
    },
  );

  fastify.delete(
    "/match/:id",
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const data = await deleteMatch(parseInt(id));

      return reply.send(data);
    },
  );
};

export default match;
