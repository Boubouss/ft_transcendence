import { getStorage } from "#services/data.ts";
import { UserClientEvent } from "#types/enums.ts";
import type { Friendship } from "#types/user.ts";
import _ from "lodash";

export function handleSendFriendRequest(
	props: {
		getter: Friendship | null;
		setter: (toSet: Friendship | null) => void;
		socket?: WebSocket | null;
	},
	form: FormData | null
) {
	const user = getStorage(sessionStorage, "transcendence_user");
	const { socket, getter: friends } = props;
	const target = form?.get("name");

	if (friends?.requests?.find((f) => f.name === target)) {
		socket?.send(JSON.stringify({ event: UserClientEvent.ACCEPT, target }));
		return;
	}

	if (
		_.isEmpty(target) ||
		user.name === target ||
		friends?.online?.find((f) => f.name === target) ||
		friends?.offline?.find((f) => f.name === target) ||
		friends?.sent?.find((f) => f.name === target)
	)
		return;

	socket?.send(JSON.stringify({ event: UserClientEvent.SEND, target }));
}
