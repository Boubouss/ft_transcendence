"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware_1 = require("../middlewares/authMiddleware");
const friendService_1 = require("../services/friendService");
const enums_1 = require("../types/enums");
const userService_1 = require("../services/userService");
const socket = async (fastify, opts) => {
    // fastify.addHook("preHandler", socketAuthMiddleware);
    const sockets = {};
    fastify.get("/friends/:id", { websocket: true }, async (socket, request) => {
        const { id } = request.params;
        const auth = await (0, authMiddleware_1.socketAuthMiddleware)(request.headers["sec-websocket-protocol"], fastify);
        if (!auth) {
            socket.send({ event: enums_1.ServerEvent.ERROR, data: { message: "AUTH" } });
            socket.close();
        }
        sockets[id] = socket;
        const users = Object.keys(sockets);
        const friends = (await (0, friendService_1.getUserFriends)(parseInt(id)));
        const friendRequests = await (0, friendService_1.getUserFriendRequests)(parseInt(id));
        const friendShip = {
            userId: parseInt(id),
            online: [],
            offline: friends.friends,
            requests: friendRequests ? friendRequests.receiver : [],
            sent: friendRequests ? friendRequests.sender : [],
        };
        friendShip.online = friendShip.offline.filter((user) => users.includes(user.id.toString()));
        friendShip.offline = friendShip.offline.filter((user) => friendShip.online.includes(user) == false);
        friendShip.online.forEach((user) => sockets[user.id.toString()].send(JSON.stringify({
            event: enums_1.ServerEvent.CONNECT,
            data: { newOnline: parseInt(id) },
        })));
        socket.send(JSON.stringify({ event: enums_1.ServerEvent.LIST, data: { ...friendShip } }));
        socket.on("message", async (message) => {
            // Envoyer ou accepter ou refuser une friendRequest
            const { event, target } = JSON.parse(message);
            const user = await (0, userService_1.getUser)({ name: target });
            if (!user)
                return socket.send(JSON.stringify({
                    event: enums_1.ServerEvent.ERROR,
                    data: { message: "Does not exist" },
                }));
            switch (event) {
                case enums_1.ClientEvent.SEND:
                    const created = await (0, friendService_1.createFriendRequest)(parseInt(id), user.id);
                    sockets[target]?.send(JSON.stringify({ event: enums_1.ServerEvent.REQUEST, data: created }));
                    break;
                case enums_1.ClientEvent.ACCEPT:
                    const accepted = await (0, friendService_1.acceptFriendRequest)(parseInt(id), user.id);
                    sockets[target]?.send(JSON.stringify({ event: enums_1.ServerEvent.ACCEPTED, data: accepted }));
                    break;
                case enums_1.ClientEvent.DECLINE:
                    const declined = await (0, friendService_1.declineFriendRequest)(parseInt(id), user.id);
                    sockets[target]?.send(JSON.stringify({ event: enums_1.ServerEvent.DECLINED, data: declined }));
                    break;
                default:
                    socket.send(JSON.stringify({ event: enums_1.ServerEvent.ERROR, data: { code: "404" } }));
            }
        });
        socket.on("close", async () => {
            console.log("close");
            const users = Object.keys(sockets);
            const friends = (await (0, friendService_1.getUserFriends)(parseInt(id)));
            const online = friends.friends.filter((user) => users.includes(user.id.toString()));
            online.forEach((user) => sockets[user.id.toString()].send(JSON.stringify({
                event: enums_1.ServerEvent.DECONNECT,
                data: { newOffline: parseInt(id) },
            })));
            delete sockets[id];
        });
        return;
    });
};
exports.default = socket;
