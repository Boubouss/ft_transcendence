import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

export async function findOrCreateRound(tournament_id: number, depth: number) {
	return await prisma.round.upsert({
		where: {
			tournament_id_depth: {
				tournament_id,
				depth
			}
		},
		create: {
			tournament_id,
			depth
		},
		update: {}
	});
}
