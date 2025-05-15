import { FastifyPluginAsync } from "fastify";
import { authMiddleware } from "../middlewares/authMiddleware";
import { FriendList, FriendRequestList, FriendShip, SocketList, SocketMessage } from "../types/types";
import { getUserFriends, getUserFriendRequests } from "../services/friendService";

const socket: FastifyPluginAsync = async (fastify, opts) => {
    fastify.addHook("preHandler", authMiddleware);

    fastify.get("/friends/:id", { websocket: true }, async (connection, request) => {
        const socket = connection.socket;
        const { id } = request.params as { id: string };
        const sockets: SocketList = {};

        socket.on("open", async () => {
            sockets[id] = socket;
            const users: string[] = Object.keys(sockets);
            const friends: FriendList = await getUserFriends(parseInt(id)) as FriendList;
            const friendRequests: FriendRequestList = await getUserFriendRequests(parseInt(id)) as FriendRequestList;
            const friendShip: FriendShip = { userId: parseInt(id), online: [], offline: friends.friends, requests: friendRequests.receiver };
            friendShip.online = friendShip.offline.filter(user => users.includes(user.id.toString()));
            friendShip.offline = friendShip.offline.filter(user => friendShip.online.includes(user) == false);
            friendShip.online.forEach((user) => sockets[user.id.toString()].send({ newOnline: parseInt(id) }));
            socket.send(friendShip);
        });

        socket.on("message", async (data: SocketMessage) => {
            // Envoyer ou accepter ou refuser une friendRequest
            switch (data.action)
            {
                case "SEND":
                    const created: FriendRequestCreated = createFriendRequest(parseInt(id), data.id) as FriendRequestCreated;
                    sockets[data.id.toString()].send(created);
                    break;
                case "ACCEPT":
                    const accepted: FriendRequestAccepted = acceptFriendRequest(parseInt(id), data.id) as FriendRequestAccepted;
                    socket.send(accepted);
                    sockets[data.id].send(accepted);
                    break;
                case "DECLINE":
                    const declined: FriendRequestDeclined = declineFriendRequest(parseInt(id), data.id) as FriendRequestDeclined;
                    socket.send(accepted);
                    sockets[data.id].send(accepted);
                    break;
                default:
                    // error
            }
        });

        socket.on("close", async () => {
            const users: string[] = Object.keys(sockets);
            const friends: FriendList = await getUserFriends(parseInt(id)) as FriendList;
            const online = friends.friends.filter(user => users.includes(user.id.toString()));
            online.forEach((user) => sockets[user.id.toString()].send({ newOffline: parseInt(id) }));
            delete sockets[id];
        });

        return ;
    });

};

export default socket;
