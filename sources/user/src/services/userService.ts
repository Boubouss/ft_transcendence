import { PrismaClient } from "@prisma/client";
import { Configuration, User } from "../types/types";
import * as bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const prisma: PrismaClient = new PrismaClient();

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.MAILER_ADDR,
		pass: process.env.MAILER_PSWD,
	},
});

export async function getUsers() {
	return await prisma.user.findMany();
}

export async function getUserById(id: number) {
	return await prisma.user.findUnique({
		where: { id },
		include: { configuration: true },
	});
}

export async function getUserByEmail(email: string) {
	return await prisma.user.findUnique({
		where: { email },
		include: { configuration: true },
	});
}

export async function createUser(userData: User) {
	if (userData.password) {
		const saltRounds = 10;
		userData.password = await bcrypt.hash(userData.password, saltRounds);
	}

	if (!userData.avatar) {
		userData.avatar = "default";
	}

	const result = await prisma.$transaction(async (prisma: PrismaClient) => {
		const user = await prisma.user.create({
			data: userData,
		});

		const configuration = await prisma.configuration.create({
			data: {
				userId: user.id,
			},
		});

		user.configuration = configuration;

		return user;
	});

	return result;
}

export async function updateUser(id: number, data: User) {
	if (data.password) {
		const saltRounds = 10;
		data.password = await bcrypt.hash(data.password, saltRounds);
	}

	const { id: userId, configuration: config, ...userData } = data;
	const { id: configId, userId: configUserId, ...configData } = config;

	const result = await prisma.$transaction(async (prisma: PrismaClient) => {
		const user = await prisma.user.update({
			where: { id },
			data: userData,
		});

		const configuration = await prisma.configuration.update({
			where: { userId: id },
			data: configData,
		});

		const { code2FA, ...config } = configuration;

		user.configuration = config;

		const { password, ...response } = user;

		return response;
	});

	return result;
}

export async function updateConfig(data: Configuration) {
	const { id, ...configData } = data;
	return await prisma.configuration.update({
		where: { id },
		data: configData,
	});
}

export async function deleteUser(id: number) {
	const result = await prisma.$transaction(async (prisma: PrismaClient) => {
		const configuration = await prisma.configuration.delete({
			where: { userId: id },
		});

		const user = await prisma.user.delete({
			where: { id },
		});

		user.configuration = configuration;

		return { user };
	});
	return result;
}

export async function authUser(password: string, user: User) {
	return await bcrypt.compare(password, user.password ?? "");
}

export async function generate2FA(user: User) {
	const { email } = user;

	const code = Math.floor(100000 + Math.random() * 900000).toString();

	const mailOptions = {
		from: process.env.MAILER_ADDR,
		to: email,
		subject: "Your 2FA Code",
		text: `Your 2FA code is: ${code}`,
	};

	try {
		await transporter.sendMail(mailOptions);
		user.configuration.code2FA = code;
		await updateConfig(user.configuration);
	} catch (error) {
		console.error(error);
	}
	return;
}
