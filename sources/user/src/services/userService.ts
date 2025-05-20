import { PrismaClient } from "@prisma/client";
import { Configuration, User, UserCreate, UserUpdate } from "../types/types";
import * as bcrypt from "bcrypt";

const prisma: PrismaClient = new PrismaClient();

export async function getUsers() {
	return await prisma.user.findMany({
		select: {
			id: true,
			username: true,
			email: true,
			avatar: true,
			configuration: {
				select: {
					id: true,
					is2FA: true,
				},
			},
		},
	});
}

export async function getUserById(id: number) {
	return await prisma.user.findUnique({
		where: { id },
		select: {
			id: true,
			username: true,
			email: true,
			avatar: true,
			configuration: {
				select: {
					id: true,
					is2FA: true,
				},
			},
		},
	});
}

export async function getUserByEmail(email: string) {
	return await prisma.user.findUnique({
		where: { email },
		select: {
			id: true,
			username: true,
			email: true,
			avatar: true,
			configuration: {
				select: {
					id: true,
					is2FA: true,
				},
			},
		},
	});
}

export async function createUser(userData: UserCreate) {
	if (userData.password) {
		const saltRounds = 10;
		userData.password = await bcrypt.hash(userData.password, saltRounds);
	}

	const result = await prisma.$transaction(async (prisma) => {
		const user: User = await prisma.user.create({
			data: userData,
			select: {
				id: true,
				username: true,
				email: true,
				avatar: true,
			},
		});

		const configuration: Configuration = await prisma.configuration.create({
			data: {
				userId: user.id,
			},
			select: {
				id: true,
				is2FA: true,
			},
		});

		return { ...user, configuration };
	});

	return result;
}

export async function updateUser(id: number, data: UserUpdate) {
	if (data.password) {
		const saltRounds = 10;
		data.password = await bcrypt.hash(data.password, saltRounds);
	}

	const { id: userId, configuration: config, ...userData } = data;
	const { id: configId, ...configData } = config;

	const result = await prisma.$transaction(async (prisma) => {
		const user: User = await prisma.user.update({
			where: { id },
			data: userData,
			select: {
				id: true,
				username: true,
				email: true,
				avatar: true,
			},
		});

		const configuration: Configuration = await prisma.configuration.update({
			where: { userId: id },
			data: configData,
			select: {
				id: true,
				is2FA: true,
			},
		});

		return { ...user, configuration };
	});

	return result;
}

export async function deleteUser(id: number) {
	const result = await prisma.$transaction(async (prisma) => {
		const configuration: Configuration = await prisma.configuration.delete({
			where: { userId: id },
			select: {
				id: true,
				is2FA: true,
			},
		});

		const user: User = await prisma.user.delete({
			where: { id },
			select: {
				id: true,
				username: true,
				email: true,
				avatar: true,
			},
		});

		return { ...user, configuration };
	});
	return result;
}
