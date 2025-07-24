import { FastifyPluginAsync } from "fastify";
import { matchCreateSchema, matchUpdateSchema } from "#validations/matchSchema";
import { findOrCreatePlayer, findOrCreatePlayers } from "#services/playerService";
import { createMatch, getPlayerMatches, updateMatch } from "#services/matchService";
import { handleTournamentMatch } from "#services/tournamentService";
import { MatchCreate, MatchUpdate } from "#types/match";
import _ from "lodash";

const match: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get("/match/:userId", async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const player = await findOrCreatePlayer(parseInt(userId));
    const matches = await getPlayerMatches(player.id);

    return reply.send(matches);
  });

  fastify.post("/match/start", { schema: matchCreateSchema }, async (request, reply) => {
    const data = request.body as MatchCreate;
    const players = await findOrCreatePlayers(data.user_ids);
    const match = await createMatch(players);

    return reply.send(match);
  });

  fastify.put("/match/end/:id", { schema: matchUpdateSchema }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const match = await updateMatch(parseInt(id), request.body as MatchUpdate);

    if (!_.isEmpty(match) && !_.isEmpty(match.round)) {
      await handleTournamentMatch(match, match.round, _.first(match.players));
    }

    return reply.send(match);
  });
};

export default match;
