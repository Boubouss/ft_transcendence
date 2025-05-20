import { FastifyPluginAsync } from "fastify";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
	FriendList,
	FriendRequestList,
	FriendShip,
	SocketList,
	SocketMessage,
	SocketResponse,
} from "../types/types";
import {
	getUserFriends,
	getUserFriendRequests,
	createFriendRequest,
	acceptFriendRequest,
	declineFriendRequest,
} from "../services/friendService";

const socket: FastifyPluginAsync = async (fastify, opts) => {
	fastify.addHook("preHandler", authMiddleware);
	const sockets: SocketList = {};

	fastify.get("/friends/:id", { websocket: true }, async (socket, request) => {
		const { id } = request.params as { id: string };

		console.log("connection");

		sockets[id] = socket;
		const users: string[] = Object.keys(sockets);
		const friends: FriendList = (await getUserFriends(
			parseInt(id)
		)) as FriendList;
		const friendRequests: FriendRequestList = (await getUserFriendRequests(
			parseInt(id)
		)) as FriendRequestList;
		const friendShip: FriendShip = {
			userId: parseInt(id),
			online: [],
			offline: friends.friends,
			requests: friendRequests.receiver,
		};
		friendShip.online = friendShip.offline.filter((user) =>
			users.includes(user.id.toString())
		);
		friendShip.offline = friendShip.offline.filter(
			(user) => friendShip.online.includes(user) == false
		);
		friendShip.online.forEach((user) =>
			sockets[user.id.toString()].send(
				JSON.stringify({ newOnline: parseInt(id) })
			)
		);
		socket.send(JSON.stringify(friendShip));

		socket.on("message", async (message: string) => {
			// Envoyer ou accepter ou refuser une friendRequest
			const data: SocketMessage = JSON.parse(message);
			switch (data.action) {
				case "SEND":
					const created: SocketResponse = (await createFriendRequest(
						parseInt(id),
						data.id
					)) as SocketResponse;
					sockets[data.id.toString()]?.send(JSON.stringify(created));
					break;
				case "ACCEPT":
					const accepted: SocketResponse = (await acceptFriendRequest(
						parseInt(id),
						data.id
					)) as SocketResponse;
					sockets[data.id.toString()]?.send(JSON.stringify(accepted));
					break;
				case "DECLINE":
					const declined: SocketResponse = (await declineFriendRequest(
						parseInt(id),
						data.id
					)) as SocketResponse;
					sockets[data.id.toString()]?.send(JSON.stringify(declined));
					break;
				default:
					socket.send("404");
			}
		});

		socket.on("close", async () => {
			const users: string[] = Object.keys(sockets);
			const friends: FriendList = (await getUserFriends(
				parseInt(id)
			)) as FriendList;
			const online = friends.friends.filter((user) =>
				users.includes(user.id.toString())
			);
			online.forEach((user) =>
				sockets[user.id.toString()].send(
					JSON.stringify({ newOffline: parseInt(id) })
				)
			);
			delete sockets[id];
			socket.send("close");
		});

		return;
	});
};

export default socket;
