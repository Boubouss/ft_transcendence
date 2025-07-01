import { Player, Match, PrismaClient, Round, MatchPlayers } from "@prisma/client";
import { MatchQuery, RoundQuery, TournamentQuery } from "#types/tournament";
import { findOrCreatePlayers } from "./playerService";
import { players, sockets, tournaments } from "#routes/lobby";
import { matchDefaultWin, sendMatchInfo } from "./matchService";
import { emitLobbyData } from "./lobbyService";
import { ClientEvent } from "#types/enums";
import { Lobby, LobbyPlayer } from "#types/lobby";
import _ from "lodash";
import { findOrCreateRound } from "./roundServices";

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

export const initTournament = async (lobby: Lobby) => {
	try {
		if (Math.log2(lobby.players.length) % 1 !== 0) {
			throw new Error("Player count must be a power of 2.");
		}

		const dbPlayers = await findOrCreatePlayers(lobby.players.map((p) => p.id));
		const tournament = await createTournament(dbPlayers);

		const firstRound = _.first(tournament.rounds);
		if (_.isEmpty(firstRound)) throw new Error("First round wasn't found.");

		for (const match of firstRound.matches) {
			sendMatchInfo(match, match.players);
		}

		const tournamentPlayer = dbPlayers.map((p) => {
			return { id: p.id, currentDepth: firstRound.depth, matchCount: 1 };
		});

		Object.seal(tournamentPlayer);

		tournaments.push({ id: tournament.id, players: tournamentPlayer });
	} catch (err) {
		emitLobbyData(lobby, `error: ${JSON.stringify(err)}`);
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

export async function handleTournamentLeave(player: LobbyPlayer) {
	for (const tournament of tournaments) {
		for (const [index, tournamentPlayer] of tournament.players.entries()) {
			if (!_.isEmpty(tournamentPlayer) && tournamentPlayer.id === player.id) {
				const interval = Math.pow(2, tournamentPlayer.matchCount);
				const pos = index - (index % interval);
				const nextOpponent = tournament.players
					.slice(pos, pos + interval)
					.find((p) => !_.isEmpty(p) && p.id !== player.id);

				if (!_.isEmpty(nextOpponent) && nextOpponent.currentDepth < tournamentPlayer.currentDepth) {
					const nextRound = await findOrCreateRound(tournament.id, nextOpponent.currentDepth);
					const match = await matchDefaultWin(tournamentPlayer, nextRound);
					if (_.isEmpty(match)) return;

					handleTournamentMatch(match, nextRound);
				}

				tournament.players[index] = null;
			}
		}
	}
}

export async function handleTournamentMatch(match: Match, matchRound: Round, looser?: MatchPlayers) {
	if (matchRound.depth <= 1) return;

	const tournament = tournaments.find((t) => t.id === matchRound.tournament_id);
	if (_.isEmpty(tournament)) return;

	const winnerIndex = tournament.players.findIndex((p) => !_.isEmpty(p) && p.id === match.winner_id);
	const winner = tournament.players[winnerIndex];
	if (_.isEmpty(winner)) return;

	if (!_.isEmpty(looser)) {
		const prevOpponentIndex = tournament.players
			.findIndex((p) => !_.isEmpty(p) && p.id === looser.player_id);

		tournament.players[prevOpponentIndex] = null;
	}

	const nextRound = await findOrCreateRound(matchRound.tournament_id, matchRound.depth - 1);

	winner.currentDepth = nextRound.depth;
	winner.matchCount += 1;

	const interval = Math.pow(2, winner.matchCount);
	const pos = winnerIndex - (winnerIndex % interval);
	const opponentPool = tournament.players.slice(pos, pos + interval);
	const nextOpponent = opponentPool.find((p) => !_.isEmpty(p) && p.id !== match.winner_id);

	if (_.isEmpty(nextOpponent)) {
		const match = await matchDefaultWin(winner, nextRound);
		if (_.isEmpty(match)) return;

		handleTournamentMatch(match, nextRound);
	} else if (nextOpponent.currentDepth === nextRound.depth) {
		const match = await prisma.match.create({
			data: {
				round_id: nextRound.id,
				players: {
					createMany: {
						data: [{ player_id: winner.id }, { player_id: nextOpponent.id }]
					}
				}
			},
			include: {
				players: true,
			}
		});

		sendMatchInfo(match, match.players);
	} else if (nextOpponent.currentDepth !== nextRound.depth) {
		const playerSocket = sockets.get(winner.id);
		if (_.isEmpty(playerSocket)) return;

		const opponentIds = opponentPool.map((p) => {
			if (!_.isEmpty(p) && p.id !== winner.id) return p.id;
		});

		playerSocket.send(JSON.stringify({
			event: ClientEvent.WAITING_OPPONENTS,
			data: {
				opponents: players.filter((p) => opponentIds.includes(p.id)),
			}
		}));
	}
}
