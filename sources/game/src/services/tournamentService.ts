import { Player, Match, PrismaClient, MatchPlayers, Round } from "@prisma/client";
import { MatchQuery, RoundQuery, TournamentQuery } from "#types/tournament";
import { findOrCreatePlayers } from "./playerService";
import { sendMatchInfo } from "./matchService";
import { emitLobbyData } from "./lobbyService";
import { LobbyInfo } from "#types/lobby";
import _ from "lodash";

const prisma: PrismaClient = new PrismaClient();

const generateTournamentQuery = (players: Player[]) => {
	const matchCount = players.length / 2;
	const tournament: TournamentQuery = { rounds: { create: [] } };

	const round: RoundQuery = {
		matches: { create: [] },
		depth: Math.log2(matchCount) + 1
	};

	for (let i = 0; i < matchCount; i++) {
		const pos = i * 2;
		const match: MatchQuery = { players: { create: [] } };

		match.players.create = players.slice(pos, pos + 2).map((p) => {
			return { player_id: p.id };
		});

		round.matches.create.push(match);
	}

	tournament.rounds.create.push(round);

	return tournament;
}

export const initTournament = async (info: LobbyInfo) => {
	try {
		if (Math.log2(info.players.length) % 1 !== 0) {
			throw new Error("Player count must be a power of 2.");
		}

		const players = await findOrCreatePlayers(info.players.map((p) => p.id));
		const tournament = await createTournament(players);

		const firstRound = _.first(tournament.rounds);
		if (_.isEmpty(firstRound)) throw new Error("First round wasn't found.");

		for (const match of firstRound.matches) {
			sendMatchInfo(match, match.players);
		}
	} catch (err) {
		emitLobbyData(info, `error: ${JSON.stringify(err)}`);
	}
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
