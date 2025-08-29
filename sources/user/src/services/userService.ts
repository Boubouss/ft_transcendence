import { PrismaClient } from "@prisma/client";
import {
	Configuration,
	GoogleData,
	User,
	UserCreate,
	UserUpdate,
} from "../types/types";
import * as bcrypt from "bcrypt";
import { pipeline } from "stream";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import { MultipartFile } from "@fastify/multipart";

const prisma: PrismaClient = new PrismaClient();

export async function getUsers() {
	return await prisma.user.findMany({
		select: {
			id: true,
			name: true,
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

export async function getUser(
	user: { id: number } | { name: string } | { email: string }
) {
	return await prisma.user.findUnique({
		where: user,
		select: {
			id: true,
			name: true,
			email: true,
			avatar: true,
			updated_at: true,
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
				name: true,
				email: true,
				avatar: true,
				updated_at: true,
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

	const { configuration: configurationData, ...userData } = data;

	const result = await prisma.$transaction(async (prisma) => {
		const user: User = await prisma.user.update({
			where: { id },
			data: userData,
			select: {
				name: true,
				email: true,
				avatar: true,
				updated_at: true,
			},
		});

		const configuration: Configuration = await prisma.configuration.update({
			where: { userId: id },
			data: configurationData ?? {},
			select: {
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
				name: true,
				email: true,
				avatar: true,
			},
		});

		return { ...user, configuration };
	});
	return result;
}

export async function googleSignIn(googleData: GoogleData) {
	const user = await getUser({ email: googleData.email });

	if (user) return user;

	let name: string = googleData.name;

	let userName = await getUser({ name });
	let index = 0;

	while (userName) {
		index++;
		name = name + index;
		userName = await getUser({ name });
	}

	const userData: UserCreate = {
		email: googleData.email,
		name: name,
		password: "user" + googleData.id + "!",
		avatar: "",
		verify: true,
	};

	const newUser: User = await createUser(userData);

	return newUser;
}

export async function verifyUser(id: number) {
	return await prisma.user.update({
		where: { id },
		data: { verify: true },
		select: {
			id: true,
			name: true,
			email: true,
			avatar: true,
		},
	});
}

export async function getPlayers(ids: number[]) {
	return await prisma.user.findMany({
		where: { id: { in: ids } },
		select: {
			id: true,
			name: true,
			avatar: true,
			updated_at: true,
		},
	});
}

export async function uploadAvatar(id: number, avatar: MultipartFile) {
	try {
		if (!avatar) throw new Error("No file =(");
		const pump = promisify(pipeline);
		const uploadDir = path.join(path.dirname(__dirname), "../storage");

		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir);
		}
		const filePath = path.join(uploadDir, "avatar_" + id + ".jpg");
		await pump(avatar.file, fs.createWriteStream(filePath));
	} catch (err: any) {
		return null;
	}
	return "avatar_" + id + ".jpg";
}
