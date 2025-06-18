import { sendMatchInfo } from "#routes/lobby";
import { MatchQuery, RoundQuery, TournamentQuery } from "#types/tournament";
import { Player, Match, PrismaClient, MatchPlayers, Round } from "@prisma/client";
import _ from "lodash";

const prisma: PrismaClient = new PrismaClient();

const shufflePlayers = (players: Player[]) => {
	for (let i = players.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = players[i];
		players[i] = players[j];
		players[j] = temp;
	}
}

const generateTournamentQuery = (players: Player[]) => {
	const tournament: TournamentQuery = { rounds: { create: [] } };

	for (let i = players.length / 2; i >= 1; i /= 2) {
		const jump = players.length / i;
		const round: RoundQuery = { matches: { create: [] }, depth: Math.log2(i) + 1 };

		shufflePlayers(players);

		for (let j = 0; j < i; j++) {
			const match: MatchQuery = { players: { create: [] } };

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
	const tournament = generateTournamentQuery(players);

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

export async function updateTournament(prevMatch: Match, matchPlayers: MatchPlayers[], round: Round) {
	if (prevMatch.winner_id === null) return;

	const playersEliminated = matchPlayers
		.filter((p) => p.player_id !== prevMatch.winner_id)
		.map((p) => p.player_id);

	await prisma.matchPlayers.deleteMany({
		where: {
			player_id: {
				in: playersEliminated,
			},
			match: {
				winner_id: null,
				round: {
					tournament_id: round.tournament_id
				}
			}
		}
	});

	if (round.depth > 1) {
		const nextMatch = await prisma.match.findFirst({
			where: {
				players: {
					some: {
						player_id: prevMatch.winner_id,
					}
				},
				round: {
					depth: round.depth - 1,
					tournament_id: round.tournament_id,
				}
			},
			include: {
				players: true,
			}
		});

		if (_.isEmpty(nextMatch) || nextMatch.players.length > 2) return;

		sendMatchInfo(nextMatch, nextMatch.players);
	}
}
