"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAuth = getUserAuth;
exports.authUser = authUser;
exports.updateConfig = updateConfig;
exports.generate2FA = generate2FA;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const prisma = new client_1.PrismaClient();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAILER_ADDR,
        pass: process.env.MAILER_PSWD,
    },
});
async function getUserAuth(name) {
    return await prisma.user.findUnique({
        where: { name },
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
async function authUser(password, user) {
    return await bcrypt.compare(password, user.password);
}
async function updateConfig(data) {
    const { id, ...configData } = data;
    return await prisma.configuration.update({
        where: { id },
        data: configData,
    });
}
async function generate2FA(user) {
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
    }
    catch (error) {
        console.error(error);
    }
    return;
}
