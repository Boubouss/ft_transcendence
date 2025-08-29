import { PrismaClient } from "@prisma/client";
import { FriendShip } from "../types/types";

const prisma: PrismaClient = new PrismaClient();

export async function getUserFriends(id: number) {
	const result = prisma.user.findUnique({
		where: { id },
		select: {
			friends: {
				select: {
					id: true,
					name: true,
					avatar: true,
					updated_at: true,
				},
			},
		},
	});

	return [...result];
}

export async function getUserFriendRequests(id: number) {
	return await prisma.user.findUnique({
		where: { id },
		select: {
			receiver: {
				select: {
					id: true,
					name: true,
					avatar: true,
					updated_at: true,
				},
			},
			sender: {
				select: {
					id: true,
					name: true,
					avatar: true,
					updated_at: true,
				},
			},
		},
	});
}

export async function getFriendShip(id: number, users: string[]) {
	const result = await prisma.$transaction(async (prisma) => {
		const friends = await getUserFriends(id);
		const requests = await getUserFriendRequests(id);
		const friendShip: FriendShip = {
			online: [],
			offline: friends ?? [],
			requests: requests?.receiver ?? [],
			sent: requests?.sender ?? [],
		};

		friendShip.online = friendShip.offline.filter((user) =>
			users.includes(user.id.toString())
		);
		friendShip.offline = friendShip.offline.filter(
			(user) => friendShip.online.includes(user) == false
		);

		return friendShip;
	});

	return result;
}

export async function createFriendRequest(
	sender: number,
	receiver: number,
	users: string[]
) {
	const result = await prisma.$transaction(async (prisma) => {
		const user = await prisma.user.update({
			where: { id: sender },
			data: {
				sender: {
					connect: { id: receiver },
				},
			},
			select: {
				id: true,
				name: true,
				avatar: true,
				updated_at: true,
			},
		});

		const receivedRequest = await prisma.user.update({
			where: { id: receiver },
			data: {
				receiver: {
					connect: { id: sender },
				},
			},
		});
	});

	return await getFriendShip(receiver, users);
}

export async function acceptFriendRequest(
	sender: number,
	receiver: number,
	users: string[]
) {
	const result = await prisma.$transaction(async (prisma) => {
		const user = await prisma.user.update({
			where: { id: sender },
			data: {
				receiver: {
					disconnect: { id: receiver },
				},
				friends: {
					connect: { id: receiver },
				},
			},
			select: {
				id: true,
				name: true,
				avatar: true,
				updated_at: true,
			},
		});

		const userReceiver = await prisma.user.update({
			where: { id: receiver },
			data: {
				sender: {
					disconnect: { id: sender },
				},
				friends: {
					connect: { id: sender },
				},
			},
		});
	});

	return await getFriendShip(receiver, users);
}

export async function declineFriendRequest(
	sender: number,
	receiver: number,
	users: string[]
) {
	const result = await prisma.$transaction(async (prisma) => {
		const user = await prisma.user.update({
			where: { id: sender },
			data: {
				receiver: {
					disconnect: { id: receiver },
				},
			},
			select: {
				id: true,
				name: true,
				avatar: true,
				updated_at: true,
			},
		});

		const userReceiver = await prisma.user.update({
			where: { id: receiver },
			data: {
				sender: {
					disconnect: { id: sender },
				},
			},
		});
	});

	return await getFriendShip(receiver, users);
}

export async function deleteFriend(
	sender: number,
	receiver: number,
	users: string[]
) {
	const result = await prisma.$transaction(async (prisma) => {
		const user = await prisma.user.update({
			where: { id: sender },
			data: {
				friends: {
					disconnect: { id: receiver },
				},
				friendOf: {
					disconnect: { id: receiver },
				},
			},
			select: {
				id: true,
				name: true,
				avatar: true,
				updated_at: true,
			},
		});

		const userReceiver = await prisma.user.update({
			where: { id: receiver },
			data: {
				friends: {
					disconnect: { id: sender },
				},
				friendOf: {
					disconnect: { id: sender },
				},
			},
		});
	});

	return await getFriendShip(receiver, users);
}
