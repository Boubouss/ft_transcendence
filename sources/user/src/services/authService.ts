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

export async function getUserAuth(username: string) {
	return await prisma.user.findUnique({
		where: { username },
		select: {
			id: true,
			email: true,
			password: true,
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
