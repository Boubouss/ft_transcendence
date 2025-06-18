import { PrismaClient } from "@prisma/client";
import _ from "lodash";

const prisma: PrismaClient = new PrismaClient();

export async function findOrCreatePlayer(userId: number) {
  return await prisma.player.upsert({
    where: {
      id: userId
    },
    create: {
      id: userId
    },
    update: {}
  });
}

export async function findOrCreatePlayers(userIds: number[]) {
  let existingUserIds: number[] = [];
  let players = await prisma.player.findMany({
    where: {
      id: {
        in: userIds
      }
    }
  });

  if (!_.isEmpty(players)) {
    existingUserIds = players.map((p) => p.id);
  }

  const playerToCreate = userIds
    .filter((userId) => !existingUserIds.includes(userId))
    .map((userId) => { return { id: userId } });

  if (!_.isEmpty(playerToCreate)) {
    const remainingPlayers = await prisma.player.createManyAndReturn({
      data: playerToCreate,
    })

    players = [...players, ...remainingPlayers];
  }

  return players;
}
