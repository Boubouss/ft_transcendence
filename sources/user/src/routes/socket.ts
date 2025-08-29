import { FastifyPluginAsync } from "fastify";
import { socketAuthMiddleware } from "../middlewares/authMiddleware";
import { Friend, FriendList, FriendShip, SocketList } from "../types/types";
import {
	getUserFriends,
	createFriendRequest,
	acceptFriendRequest,
	declineFriendRequest,
	deleteFriend,
	getFriendShip,
} from "../services/friendService";
import { ClientEvent, ServerEvent } from "../types/enums";
import { getUser } from "../services/userService";

const socket: FastifyPluginAsync = async (fastify, opts) => {
	const sockets: SocketList = {};

	fastify.get("/:id", { websocket: true }, async (socket, request) => {
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
		let users: string[] = Object.keys(sockets);

		const friendShip: FriendShip = await getFriendShip(parseInt(id), users);

		friendShip.online.forEach(async (user) => {
			const update = await getFriendShip(user.id, users);
			sockets[user.id.toString()].send(
				JSON.stringify({
					event: ServerEvent.UPDATE,
					data: update,
				})
			);
		});
		socket.send(
			JSON.stringify({ event: ServerEvent.UPDATE, data: { ...friendShip } })
		);

		socket.on("message", async (message: string) => {
			// Envoyer ou accepter ou refuser une friendRequest
			const { event, target }: { event: ClientEvent; target: string } =
				JSON.parse(message);
			const user = await getUser({ name: target });

			if (!user) {
				return socket.send(
					JSON.stringify({
						event: ServerEvent.ERROR,
						data: { message: "Does not exist" },
					})
				);
			}

			switch (event) {
				case ClientEvent.SEND:
					const created = await createFriendRequest(
						parseInt(id),
						user.id,
						users
					);

					sockets[user.id.toString()]?.send(
						JSON.stringify({ event: ServerEvent.UPDATE, data: created })
					);

					socket.send(
						JSON.stringify({
							event: ServerEvent.SENT,
						})
					);
					break;
				case ClientEvent.ACCEPT:
					const accepted = await acceptFriendRequest(
						parseInt(id),
						user.id,
						users
					);
					sockets[user.id.toString()]?.send(
						JSON.stringify({ event: ServerEvent.UPDATE, data: accepted })
					);
					break;
				case ClientEvent.DECLINE:
					const declined = await declineFriendRequest(
						parseInt(id),
						user.id,
						users
					);
					sockets[user.id.toString()]?.send(
						JSON.stringify({ event: ServerEvent.UPDATE, data: declined })
					);
					break;
				case ClientEvent.DELETE:
					const deleted = await deleteFriend(parseInt(id), user.id, users);
					sockets[user.id.toString()]?.send(
						JSON.stringify({ event: ServerEvent.UPDATE, data: deleted })
					);
					break;
				default:
					socket.send(
						JSON.stringify({ event: ServerEvent.ERROR, data: { code: "404" } })
					);
			}

			const update = await getFriendShip(parseInt(id), users);
			socket.send(JSON.stringify({ event: ServerEvent.UPDATE, data: update }));
		});

		socket.on("close", async () => {
			users = users.filter((u) => u !== id);
			const friends = (await getUserFriends(parseInt(id))) ?? [];
			const online = friends?.filter((user: Friend) =>
				users.includes(user.id.toString())
			);
			online.forEach(async (user: Friend) => {
				const update = await getFriendShip(user.id, users);

				sockets[user.id.toString()]?.send(
					JSON.stringify({
						event: ServerEvent.UPDATE,
						data: update,
					})
				);
			});
			delete sockets[id];
		});

		return;
	});
};

export default socket;
