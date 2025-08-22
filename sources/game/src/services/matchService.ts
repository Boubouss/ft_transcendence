import { findOrCreatePlayers } from "./playerService";
import { emitLobbyData, whisperData } from "./lobbyService";
import { TournamentPlayer } from "#types/tournament";
import { ClientEvent } from "#types/enums";
import { MatchUpdate } from "#types/match";
import { playerInstance } from "#routes/lobby";
import { Lobby } from "#types/lobby";
import axios from "axios";
import _ from "lodash";

import {
  Match,
  MatchPlayers,
  Player,
  PrismaClient,
  Round,
} from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

export const initGameInstance = async (lobby: Lobby) => {
  try {
    const players = await findOrCreatePlayers(lobby.players.map((p) => p.id));
    const match = await createMatch(players);

    sendMatchInfo(lobby, match, match.players);
  } catch (err) {
    emitLobbyData(lobby, `error: ${JSON.stringify(err)}`);
  }
};

export const sendMatchInfo = async (
  lobby: Lobby,
  match: Match,
  players: MatchPlayers[],
) => {
  const requestData = {
    gameId: match.id.toString(),
    playersId: players.map((p) => p.player_id.toString()),
    scoreMax: lobby.score_max,
  };

  await axios
    .post(`${process.env.API_LOGIC}/games`, requestData)
    .catch((e) => console.log(e));

  for (const player of players) {
    playerInstance.set(player.player_id, {
      id: match.id,
      type: "match",
    });
  }

  whisperData(
    players.map((p) => p.player_id),
    JSON.stringify({
      event: ClientEvent.GAME_CREATED,
      data: {
        gameId: match.id,
      },
    }),
  );
};

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
      players: true,
    },
  });
}

export async function createMatch(players: Player[]) {
  const data = players.map((p) => {
    return { player_id: p.id };
  });

  return await prisma.match.create({
    data: {
      players: {
        createMany: {
          data,
        },
      },
    },
    include: {
      players: true,
    },
  });
}

export async function matchDefaultWin(
  winner: TournamentPlayer,
  nextRound: Round,
) {
  if (_.isEmpty(winner)) return;

  return await prisma.match.create({
    data: {
      round_id: nextRound.id,
      winner_id: winner.id,
      players: {
        create: {
          player_id: winner.id,
        },
      },
    },
  });
}

export async function deleteMatch(match_id: number) {
  return await prisma.$transaction(async (prisma) => {
    await prisma.matchPlayers.deleteMany({
      where: { match_id },
    });

    return await prisma.match.delete({
      where: { id: match_id },
      select: {
        id: true,
      },
    });
  });
}

export async function updateMatch(match_id: number, data: MatchUpdate) {
  data.infos.forEach(async (info) => {
    await prisma.matchPlayers.update({
      where: {
        match_id_player_id: {
          match_id: match_id,
          player_id: info.player_id,
        },
      },
      data: {
        score: info.score,
      },
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
        include: {
          player: true,
        },
      },
    },
  });
}
