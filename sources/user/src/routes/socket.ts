import { FastifyPluginAsync } from "fastify";
import { socketAuthMiddleware } from "../middlewares/authMiddleware";
import {
	FriendList,
	FriendRequestList,
	FriendShip,
	SocketList,
} from "../types/types";
import {
	getUserFriends,
	getUserFriendRequests,
	createFriendRequest,
	acceptFriendRequest,
	declineFriendRequest,
} from "../services/friendService";
import { ClientEvent, ServerEvent } from "../types/enums";
import { getUser } from "../services/userService";

const socket: FastifyPluginAsync = async (fastify, opts) => {
	// fastify.addHook("preHandler", socketAuthMiddleware);
	const sockets: SocketList = {};

	fastify.get("/friends/:id", { websocket: true }, async (socket, request) => {
		const { id } = request.params as { id: string };
		const auth = await socketAuthMiddleware(
			request.headers["sec-websocket-protocol"],
			fastify
		);

		if (!auth) {
			socket.send({ event: ServerEvent.ERROR, data: { message: "AUTH" } });
			socket.close();
		}

		sockets[id] = socket;
		const users: string[] = Object.keys(sockets);
		const friends: FriendList = (await getUserFriends(
			parseInt(id)
		)) as FriendList;
		const friendRequests = await getUserFriendRequests(parseInt(id));
		const friendShip: FriendShip = {
			userId: parseInt(id),
			online: [],
			offline: friends.friends,
			requests: friendRequests ? friendRequests.receiver : [],
			sent: friendRequests ? friendRequests.sender : [],
		};
		friendShip.online = friendShip.offline.filter((user) =>
			users.includes(user.id.toString())
		);
		friendShip.offline = friendShip.offline.filter(
			(user) => friendShip.online.includes(user) == false
		);
		friendShip.online.forEach((user) =>
			sockets[user.id.toString()].send(
				JSON.stringify({
					event: ServerEvent.CONNECT,
					data: { newOnline: parseInt(id) },
				})
			)
		);
		socket.send(
			JSON.stringify({ event: ServerEvent.LIST, data: { ...friendShip } })
		);

		socket.on("message", async (message: string) => {
			// Envoyer ou accepter ou refuser une friendRequest
			const { event, target }: { event: ClientEvent; target: string } =
				JSON.parse(message);
			const user = await getUser({ name: target });

			if (!user)
				return socket.send(
					JSON.stringify({
						event: ServerEvent.ERROR,
						data: { message: "Does not exist" },
					})
				);

			switch (event) {
				case ClientEvent.SEND:
					const created = await createFriendRequest(parseInt(id), user.id);
					sockets[target]?.send(
						JSON.stringify({ event: ServerEvent.REQUEST, data: created })
					);
					break;
				case ClientEvent.ACCEPT:
					const accepted = await acceptFriendRequest(parseInt(id), user.id);
					sockets[target]?.send(
						JSON.stringify({ event: ServerEvent.ACCEPTED, data: accepted })
					);
					break;
				case ClientEvent.DECLINE:
					const declined = await declineFriendRequest(parseInt(id), user.id);
					sockets[target]?.send(
						JSON.stringify({ event: ServerEvent.DECLINED, data: declined })
					);
					break;
				default:
					socket.send(
						JSON.stringify({ event: ServerEvent.ERROR, data: { code: "404" } })
					);
			}
		});

		socket.on("close", async () => {
			console.log("close");
			const users: string[] = Object.keys(sockets);
			const friends: FriendList = (await getUserFriends(
				parseInt(id)
			)) as FriendList;
			const online = friends.friends.filter((user) =>
				users.includes(user.id.toString())
			);
			online.forEach((user) =>
				sockets[user.id.toString()].send(
					JSON.stringify({
						event: ServerEvent.DECONNECT,
						data: { newOffline: parseInt(id) },
					})
				)
			);
			delete sockets[id];
		});

		return;
	});
};

export default socket;
