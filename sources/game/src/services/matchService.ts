import { Player, PrismaClient } from "@prisma/client";
import { MatchUpdate } from "../types/types";
import _ from "lodash";

const prisma: PrismaClient = new PrismaClient();

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
      players: true,
    }
  });
}
