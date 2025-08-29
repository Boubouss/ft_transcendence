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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.getUser = getUser;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.googleSignIn = googleSignIn;
exports.verifyUser = verifyUser;
exports.getPlayers = getPlayers;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function getUsers() {
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
async function getUser(user) {
    return await prisma.user.findUnique({
        where: user,
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
async function createUser(userData) {
    if (userData.password) {
        const saltRounds = 10;
        userData.password = await bcrypt.hash(userData.password, saltRounds);
    }
    const result = await prisma.$transaction(async (prisma) => {
        const user = await prisma.user.create({
            data: userData,
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
            },
        });
        const configuration = await prisma.configuration.create({
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
async function updateUser(id, data) {
    if (data.password) {
        const saltRounds = 10;
        data.password = await bcrypt.hash(data.password, saltRounds);
    }
    const { id: userId, configuration: config, ...userData } = data;
    const { id: configId, ...configData } = config;
    const result = await prisma.$transaction(async (prisma) => {
        const user = await prisma.user.update({
            where: { id },
            data: userData,
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
            },
        });
        const configuration = await prisma.configuration.update({
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
async function deleteUser(id) {
    const result = await prisma.$transaction(async (prisma) => {
        const configuration = await prisma.configuration.delete({
            where: { userId: id },
            select: {
                id: true,
                is2FA: true,
            },
        });
        const user = await prisma.user.delete({
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
async function googleSignIn(googleData) {
    const user = await getUser({ email: googleData.email });
    if (user)
        return { ...user };
    let name = googleData.name;
    let userName = await getUser({ name });
    let index = 0;
    while (userName) {
        index++;
        name = name + index;
        userName = await getUser({ name });
    }
    const userData = {
        email: googleData.email,
        name: name,
        password: "user" + googleData.id + "!",
        avatar: "",
        verify: true,
    };
    const newUser = await createUser(userData);
    return newUser;
}
async function verifyUser(id) {
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
async function getPlayers(ids) {
    return await prisma.user.findMany({
        where: { id: { in: ids } },
        select: {
            id: true,
            name: true,
            avatar: true,
        },
    });
}
