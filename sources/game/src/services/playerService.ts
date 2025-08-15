import { playerInstance } from "#routes/lobby";
import { PrismaClient } from "@prisma/client";
import _ from "lodash";
import { sendNextOpponents } from "./tournamentService";
import { whisperData } from "./lobbyService";
import { ClientEvent } from "#types/enums";

const prisma: PrismaClient = new PrismaClient();

export async function findOrCreatePlayer(userId: number) {
  return await prisma.player.upsert({
    where: {
      id: userId,
    },
    create: {
      id: userId,
    },
    update: {},
  });
}

export async function handlePlayerInstance(playerId: number) {
  const instance = playerInstance.get(playerId);
  if (_.isEmpty(instance)) return;

  if (instance.type === "waitingRoom") {
    sendNextOpponents(playerId, instance.id);
  } else if (instance.type === "match") {
    whisperData(
      [playerId],
      JSON.stringify({
        event: ClientEvent.GAME_CREATED,
        data: {
          gameId: instance.id,
        },
      }),
    );
  }
}

export async function findOrCreatePlayers(userIds: number[]) {
  let existingUserIds: number[] = [];
  let players = await prisma.player.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
  });

  if (!_.isEmpty(players)) {
    existingUserIds = players.map((p) => p.id);
  }

  const playerToCreate = userIds
    .filter((userId) => !existingUserIds.includes(userId))
    .map((userId) => {
      return { id: userId };
    });

  if (!_.isEmpty(playerToCreate)) {
    const remainingPlayers = await prisma.player.createManyAndReturn({
      data: playerToCreate,
    });

    players = [...players, ...remainingPlayers];
  }

  return players;
}
