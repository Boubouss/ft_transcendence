import { PrismaClient } from "@prisma/client";
import { Configuration, UserAuth, User, UserCreate, UserUpdate, ConfigAuth } from "../types/types";

const prisma: PrismaClient = new PrismaClient();

export async function getUserFriends(id: number)
{
    return await prisma.user.findUnique({
        where: { id },
        select: {
            friends: {
                select: {
                    id: true,
                    name: true,
                    avatar: true
                }
            }
        }
    });
}

export async function getUserFriendRequests(id: number)
{
    return await prisma.user.findUnique({
        where: { id },
        select: {
            receiver: {
                select: {
                    id: true,
                    name: true,
                    avatar: true
                }
            }
        }
    });
}