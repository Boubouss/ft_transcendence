import { FastifyPluginAsync } from "fastify";
import { authMiddleware } from "../middlewares/authMiddleware";
import { Connected, FriendShip } from "../types/types";

const socket: FastifyPluginAsync = async (fastify, opts) => {
    fastify.addHook("preHandler", authMiddleware);

    fastify.get("/friends/:id", { websocket: true }, async (connection, request) => {
        const socket = connection.socket;
        const { id } = request.params as { id: string };
        const connected: Connected = {};

        socket.on("open", () => {
            // Recuperer depuis la db tout les amis connectes
            connected[parseInt(id)] = socket;
            const friendShip: UserFriend[] = getUserFriendShip(parseInt(id)) as UserFriend[];
            socket.send(friendShip);
        });

        socket.on("message", (message) => {

        });

        socket.on("close", () => {

        });

        return ;
    });

    fastify.get("/friendRequests/:id", { websocket: true }, async (connection, request) => {
        const socket = connection.socket;
        socket.on("open", () => {

        });

        socket.on("message", (message) => {

        });

        socket.on("close", () => {

        });
        return ;
    });

};

export default socket;
