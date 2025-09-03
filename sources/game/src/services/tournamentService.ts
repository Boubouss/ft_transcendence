import { MatchQuery, RoundQuery, TournamentQuery } from "#types/tournament";
import { matchDefaultWin, sendMatchInfo } from "./matchService";
import {
	broadcastData,
	destroyLobby,
	emitLobbyData,
	findPlayerLobby,
	leaveLobby,
	whisperData,
} from "./lobbyService";
import { findOrCreatePlayers } from "./playerService";
import { findOrCreateRound } from "./roundServices";
import { Lobby, LobbyPlayer } from "#types/lobby";
import { ClientEvent } from "#types/enums";
import _ from "lodash";

import {
	Player,
	Match,
	PrismaClient,
	Round,
	MatchPlayers,
} from "@prisma/client";

import {
	lobbies,
	playerInstance,
	players,
	sockets,
	tournaments,
} from "#routes/lobby";

const prisma: PrismaClient = new PrismaClient();

const generateTournamentQuery = (players: Player[], scoreMax: number) => {
	const matchCount = players.length / 2;
	const tournament: TournamentQuery = { rounds: { create: [] } };

	const round: RoundQuery = {
		matches: { create: [] },
		depth: Math.log2(matchCount) + 1,
	};

	for (let i = 0; i < matchCount; i++) {
		const pos = i * 2;
		const match: MatchQuery = { score_max: scoreMax, players: { create: [] } };

		match.players.create = players.slice(pos, pos + 2).map((p) => {
			return { player_id: p.id };
		});

		round.matches.create.push(match);
	}

	tournament.rounds.create.push(round);

	return tournament;
};

export const initTournament = async (lobby: Lobby) => {
	try {
		if (Math.log2(lobby.players.length) % 1 !== 0) {
			throw new Error("Player count must be a power of 2.");
		}

		const dbPlayers = await findOrCreatePlayers(lobby.players.map((p) => p.id));
		const tournament = await createTournament(dbPlayers, lobby.score_max);

		const firstRound = _.first(tournament.rounds);
		if (_.isEmpty(firstRound)) throw new Error("First round wasn't found.");

		lobby.joinable = false;

		for (const match of firstRound.matches) {
			sendMatchInfo(match, match.players);
		}

		const tournamentPlayer = dbPlayers.map((p) => {
			return { id: p.id, currentDepth: firstRound.depth, matchCount: 1 };
		});

		Object.seal(tournamentPlayer);

		tournaments.set(tournament.id, {
			id: tournament.id,
			lobbyId: lobby.id,
			scoreMax: lobby.score_max,
			players: tournamentPlayer,
		});
	} catch (err) {
		emitLobbyData(lobby, `error: ${JSON.stringify(err)}`);
	}
};

export async function getPlayerTournaments(playerId: number) {
	return await prisma.tournament.findMany({
		where: {
			rounds: {
				some: {
					matches: {
						some: {
							players: {
								some: {
									player_id: playerId,
								},
							},
						},
					},
				},
			},
		},
		include: {
			rounds: {
				include: {
					matches: {
						include: {
							players: true,
						},
					},
				},
			},
		},
	});
}

export async function createTournament(players: Player[], scoreMax: number) {
	const tournament = generateTournamentQuery(players, scoreMax);

	return await prisma.tournament.create({
		data: tournament,
		include: {
			rounds: {
				include: {
					matches: {
						include: {
							players: true,
						},
					},
				},
			},
		},
	});
}

export async function sendNextOpponents(
	playerId: number,
	tournamentId: number
) {
	const tournament = tournaments.get(tournamentId);
	if (_.isEmpty(tournament)) return;

	const player = tournament.players.find((p) => {
		return !_.isEmpty(p) && p.id === playerId;
	});

	if (_.isEmpty(player)) return;

	const playerIndex = tournament.players.indexOf(player);
	const playerSocket = sockets.get(player.id);
	if (_.isEmpty(playerSocket)) return;

	const interval = Math.pow(2, player.matchCount);
	const pos = playerIndex - (playerIndex % interval);

	const opponentPool = tournament.players.slice(pos, pos + interval);
	const opponentIds = opponentPool.map((p) => {
		if (!_.isEmpty(p) && p.id !== player.id) return p.id;
	});
	if (_.isEmpty(opponentIds)) return;

	playerSocket.send(
		JSON.stringify({
			event: ClientEvent.WAITING_OPPONENTS,
			data: {
				opponents: players.filter((p) => opponentIds.includes(p.id)),
			},
		})
	);
}

export async function handleTournamentLeave(player: LobbyPlayer) {
	for (const tournament of tournaments.values()) {
		for (const [index, tournamentPlayer] of tournament.players.entries()) {
			if (!_.isEmpty(tournamentPlayer) && tournamentPlayer.id === player.id) {
				const interval = Math.pow(2, tournamentPlayer.matchCount);
				const pos = index - (index % interval);
				const nextOpponent = tournament.players
					.slice(pos, pos + interval)
					.find((p) => !_.isEmpty(p) && p.id !== player.id);

				if (
					!_.isEmpty(nextOpponent) &&
					nextOpponent.currentDepth < tournamentPlayer.currentDepth
				) {
					const nextRound = await findOrCreateRound(
						tournament.id,
						nextOpponent.currentDepth
					);
					const match = await matchDefaultWin(
						tournamentPlayer,
						nextRound,
						tournament.scoreMax
					);
					if (_.isEmpty(match)) return;

					handleTournamentMatch(match, nextRound);
				}

				tournament.players[index] = null;
			}
		}
	}
}

export async function handleTournamentMatch(
	match: Match,
	matchRound: Round,
	looser?: MatchPlayers
) {
	const tournament = tournaments.get(matchRound.tournament_id);
	if (_.isEmpty(tournament)) return;

	if (matchRound.depth <= 1) {
		const lobby = findPlayerLobby(match.winner_id ?? -1);
		const player = players.find((p) => p.id === match.winner_id);

		if (!_.isEmpty(lobby)) {
			destroyLobby(lobby);
		}

		if (!_.isEmpty(player)) {
			whisperData(
				[player.id],
				JSON.stringify({
					event: ClientEvent.TOURNAMENT_WON,
				})
			);
		}

		tournaments.delete(matchRound.tournament_id);

		return;
	}

	const winnerIndex = tournament.players.findIndex(
		(p) => !_.isEmpty(p) && p.id === match.winner_id
	);
	const winner = tournament.players[winnerIndex];
	if (_.isEmpty(winner)) return;

	if (!_.isEmpty(looser)) {
		const player = players.find((p) => p.id === looser.player_id);

		const prevOpponentIndex = tournament.players.findIndex((p) => {
			return !_.isEmpty(p) && p.id === looser.player_id;
		});

		tournament.players[prevOpponentIndex] = null;

		const lobby = lobbies.find((l) => {
			return l.players.map((p) => p.id).includes(looser.player_id);
		});

		if (!_.isEmpty(lobby) && !_.isEmpty(player)) {
			leaveLobby(lobby, player);
		}
	}

	const nextRound = await findOrCreateRound(
		matchRound.tournament_id,
		matchRound.depth - 1
	);

	winner.currentDepth = nextRound.depth;
	winner.matchCount += 1;

	const interval = Math.pow(2, winner.matchCount);
	const pos = winnerIndex - (winnerIndex % interval);
	const opponentPool = tournament.players.slice(pos, pos + interval);
	const nextOpponent = opponentPool.find(
		(p) => !_.isEmpty(p) && p.id !== match.winner_id
	);

	if (_.isEmpty(nextOpponent)) {
		const nextMatch = await matchDefaultWin(winner, nextRound, match.score_max);
		if (_.isEmpty(nextMatch)) return;

		handleTournamentMatch(nextMatch, nextRound);
	} else if (nextOpponent.currentDepth === nextRound.depth) {
		const nextMatch = await prisma.match.create({
			data: {
				score_max: match.score_max,
				round_id: nextRound.id,
				players: {
					createMany: {
						data: [{ player_id: winner.id }, { player_id: nextOpponent.id }],
					},
				},
			},
			include: {
				players: true,
			},
		});

		sendMatchInfo(nextMatch, nextMatch.players);
	} else if (nextOpponent.currentDepth !== nextRound.depth) {
		const playerSocket = sockets.get(winner.id);
		if (_.isEmpty(playerSocket)) return;

		const opponentIds = opponentPool.map((p) => {
			if (!_.isEmpty(p) && p.id !== winner.id) return p.id;
		});

		playerInstance.set(winner.id, {
			id: tournament.id,
			type: "waitingRoom",
		});

		playerSocket.send(
			JSON.stringify({
				event: ClientEvent.WAITING_OPPONENTS,
				data: {
					opponents: players.filter((p) => opponentIds.includes(p.id)),
				},
			})
		);
	}
}
