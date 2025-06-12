import { Match, Round, Tournament } from "#types/tournament";
import { Player, PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

const shufflePlayers = (players: Player[]) => {
	for (let i = players.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = players[i];
		players[i] = players[j];
		players[j] = temp;
	}
}

const generateTournament = (players: Player[]) => {
	const tournament: Tournament = { rounds: { create: [] } };

	for (let i = players.length / 2; i >= 1; i /= 2) {
		const jump = players.length / i;
		const round: Round = { matches: { create: [] } };

		shufflePlayers(players);

		for (let j = 0; j < i; j++) {
			const match: Match = { players: { create: [] } };

			match.players.create = players.slice(j * jump, (j * jump) + jump).map((p) => {
				return { player_id: p.id };
			});

			round.matches.create.push(match);
		}

		tournament.rounds.create.push(round);
	}

	return tournament;
}

export async function getPlayerTournaments(playerId: number) {
	return await prisma.tournament.findMany({
		where: {
			rounds: {
				some: {
					matches: {
						some: {
							players: {
								some: {
									player_id: playerId
								}
							}
						}
					}
				}
			}
		},
		include: {
			rounds: {
				include: {
					matches: {
						include: {
							players: true
						}
					}
				}
			}
		}
	});
}

export async function createTournament(players: Player[]) {
	const tournament = generateTournament(players);

	return await prisma.tournament.create({
		data: tournament,
		include: {
			rounds: {
				include: {
					matches: {
						include: {
							players: true,
						}
					}
				}
			}
		}
	});
}
