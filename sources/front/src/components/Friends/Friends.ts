import { useEffect, useState } from "#core/framework.ts";
import { createElement } from "#core/render.ts";
import { handleSocketFriends } from "#requests/friendsRequest.ts";
import { getStorage } from "#services/data.ts";
import type { Friend } from "#types/user.ts";

const Friends = () => {
	const [friends, setFriends] = useState<Friend[] | null>([]);
	console.log("test");

	const [test, setTest] = useState(false);

	const user = getStorage(sessionStorage, "transcendence_user");
	const token = getStorage(localStorage, "transcendence_conf").token;

	// useEffect(() => {
	// 	const socket = new WebSocket(
	// 		`${import.meta.env.VITE_LOBBY_WSS}/${user.id}?token=${token}`
	// 	);

	// 	socket.onmessage = (message) => handleSocketFriends(message);

	// 	return () => {
	// 		if (socket.readyState === WebSocket.OPEN) {
	// 			socket.close();
	// 		}
	// 	};
	// }, []);

	// useEffect(() => {
	// 	console.log(test);
	// }, [test]);

	// console.log(test);

	return createElement(
		"div",
		{
			onClick: () => {
				console.log(test);
				setTest(!test);
				console.log(test);
			},
		},
		"Friend List ..." + test
	);
};

export default Friends;
