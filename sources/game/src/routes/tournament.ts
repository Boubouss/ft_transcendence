import { findOrCreatePlayer, findOrCreatePlayers } from "#services/playerService";
import { createTournament, getPlayerTournaments } from "#services/tournamentService";
import { TournamentCreate } from "#types/tournament";
import { FastifyPluginAsync } from "fastify";

const tournament: FastifyPluginAsync = async (fastify, opts) => {
	fastify.get("/tournament/:userId", async (request, reply) => {
		const { userId } = request.params as { userId: string };
		const player = await findOrCreatePlayer(parseInt(userId));
		const tournaments = await getPlayerTournaments(player.id);

		return reply.send(tournaments);
	});

	fastify.post("/tournament/start", async (request, reply) => {
		const data = request.body as TournamentCreate;
		if (Math.log2(data.user_ids.length) % 1 !== 0) {
			throw new Error("Player count must be a power of 2.");
		}

		const players = await findOrCreatePlayers(data.user_ids);
		const tournament = await createTournament(players, 5);

		return reply.send(tournament);
	});
};

export default tournament;
