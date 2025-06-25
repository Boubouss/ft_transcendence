import { Match, MatchPlayers, Player, PrismaClient, Round } from "@prisma/client";
import { findOrCreatePlayers } from "./playerService";
import { emitLobbyData, whisperData } from "./lobbyService";
import { ClientEvent } from "#types/enums";
import { MatchUpdate } from "#types/match";
import { Lobby } from "#types/lobby";
import axios from "axios";
import _ from "lodash";
import { TournamentPlayer } from "#types/tournament";

const prisma: PrismaClient = new PrismaClient();

export const initGameInstance = async (lobby: Lobby) => {
  try {
    const players = await findOrCreatePlayers(lobby.players.map((p) => p.id));
    const match = await createMatch(players);

    sendMatchInfo(match, match.players);
  } catch (err) {
    emitLobbyData(lobby, `error: ${JSON.stringify(err)}`);
  }
}

export const sendMatchInfo = async (match: Match, players: MatchPlayers[]) => {
  const requestData = {
    gameId: match.id.toString(),
    playersId: players.map((p) => p.player_id.toString()),
    scoreMax: 5,
  };

  await axios.post(
    `${process.env.API_LOGIC}/create_game`,
    requestData
  );

  whisperData(
    players.map((p) => p.player_id),
    JSON.stringify({
      event: ClientEvent.GAME_CREATED,
      data: {
        gameId: match.id
      }
    })
  );
}


export async function getPlayerMatches(playerId: number) {
  return await prisma.match.findMany({
    where: {
      players: {
        some: {
          player_id: playerId,
        },
      },
    },
    include: {
      players: true
    },
  });
}

export async function createMatch(players: Player[]) {
  const data = players.map((p) => { return { player_id: p.id } });

  return await prisma.match.create({
    data: {
      players: {
        createMany: {
          data,
        },
      }
    },
    include: {
      players: true,
    }
  })
}

export async function matchDefaultWin(winner: TournamentPlayer, nextRound: Round) {
  if (_.isEmpty(winner)) return;

  return await prisma.match.create({
    data: {
      round_id: nextRound.id,
      winner_id: winner.id,
      players: {
        create: {
          player_id: winner.id
        }
      }
    }
  });
}

export async function updateMatch(match_id: number, data: MatchUpdate) {
  data.infos.forEach(async (info) => {
    await prisma.matchPlayers.update({
      where: {
        match_id_player_id: {
          match_id: match_id,
          player_id: info.player_id
        }
      },
      data: {
        score: info.score
      }
    });
  });

  return await prisma.match.update({
    where: {
      id: match_id,
    },
    data: {
      winner_id: data.winner_id,
    },
    include: {
      round: true,
      players: {
        where: {
          player_id: { not: data.winner_id },
        },
      },
    }
  });
}
