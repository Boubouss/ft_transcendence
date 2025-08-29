"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFriends = getUserFriends;
exports.getUserFriendRequests = getUserFriendRequests;
exports.createFriendRequest = createFriendRequest;
exports.acceptFriendRequest = acceptFriendRequest;
exports.declineFriendRequest = declineFriendRequest;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getUserFriends(id) {
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
async function getUserFriendRequests(id) {
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
            sender: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
        },
    });
}
async function createFriendRequest(sender, receiver) {
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
        return user;
    });
    return result;
}
async function acceptFriendRequest(sender, receiver) {
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
        return user;
    });
    return result;
}
async function declineFriendRequest(sender, receiver) {
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
        return user;
    });
    return result;
}
