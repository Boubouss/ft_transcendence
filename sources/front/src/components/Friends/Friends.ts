import { useEffect, useState } from "#core/framework.ts";
import { createElement } from "#core/render.ts";
import type { Friend } from "#types/user.ts";

const Friends = () => {
	const [friends, setFriends] = useState<Friend[] | null>([]);

	useEffect(() => {
		const socket = new WebSocket(
			`${import.meta.env.VITE_LOBBY_WSS}/${user_id}`
		);

		socket.onmessage = (event) => handleSocketFriend(event);

		return () => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.close();
			}
		};
	}, []);

	return createElement("div", {}, "Friend List ...");
};

export default Friends;
