// services/userService.ts

import { PrismaClient } from "@prisma/client";
import { User } from "../types/types";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function getUsers() {
	return await prisma.user.findMany();
}

export async function getUserById(id: number) {
	return await prisma.user.findUnique({
		where: { id },
	});
}

export async function getUserByEmail(email: string) {
	return await prisma.user.findUnique({
		where: { email: email },
	});
}

export async function createUser(userData: Omit<User, "id">) {
	if (userData.password) {
		const saltRounds = 10;
		userData.password = await bcrypt.hash(userData.password, saltRounds);
	}

	if (!userData.avatar) {
		userData.avatar = "default";
	}

	return await prisma.user.create({
		data: userData,
	});
}

export async function updateUser(id: number, userData: Omit<User, "id">) {
	if (userData.password) {
		const saltRounds = 10;
		userData.password = await bcrypt.hash(userData.password, saltRounds);
	}

	return await prisma.user.update({
		where: { id },
		data: userData,
	});
}

export async function deleteUser(id: number) {
	return await prisma.user.delete({
		where: { id },
	});
}
