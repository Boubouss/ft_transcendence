import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

export async function getUserFriends(id: number) {
	return await prisma.user.findUnique({
		where: { id },
		select: {
			friends: {
				select: {
					id: true,
					name: true,
					avatar: true,
				},
			},
		},
	});
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
				},
			},
		},
	});
}

export async function createFriendRequest(sender: number, receiver: number) {
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

		return { from: { ...user }, what: "SEND" };
	});

	return result;
}

export async function acceptFriendRequest(sender: number, receiver: number) {
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

		return { from: { ...user }, what: "ACCEPT" };
	});

	return result;
}

export async function declineFriendRequest(sender: number, receiver: number) {
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

		return { from: { ...user }, what: "DECLINE" };
	});

	return result;
}
