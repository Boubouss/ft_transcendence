import { PrismaClient } from "@prisma/client";
import { UserAuth, ConfigAuth } from "../types/types";
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

export async function getUserAuth(name: string) {
	return await prisma.user.findUnique({
		where: { name },
		select: {
			id: true,
			email: true,
			verify: true,
			password: true,
			updated_at: true,
			configuration: {
				select: {
					id: true,
					is2FA: true,
					code2FA: true,
				},
			},
		},
	});
}

export async function authUser(password: string, user: UserAuth) {
	return await bcrypt.compare(password, user.password);
}

export async function updateConfig(data: ConfigAuth) {
	const { id, ...configData } = data;
	return await prisma.configuration.update({
		where: { id },
		data: configData,
	});
}

export async function generate2FA(user: UserAuth) {
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

export async function updateToken(id: number, token: string) {
	return await prisma.user.update({
		where: { id },
		data: { token },
	});
}

export async function checkRight(id: number, authorization: string) {
	const token = await prisma.user.findUnique({
		where: { id },
		select: {
			token: true,
		},
	});
	if (!token || token.token.localeCompare(authorization.slice(7))) return false;
	return true;
}
