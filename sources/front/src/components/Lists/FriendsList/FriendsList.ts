import FriendCard, {
	type FriendCardType,
} from "#components/Card/FriendCard/FriendCard.ts";
import { createElement } from "#core/render.ts";
import type { Friendship } from "#types/user.ts";
import _ from "lodash";
import List from "../List";
import FormFriend from "#components/Forms/FormFriend/FormFriend.ts";
import { list_friends } from "../style";
import { useLanguage } from "#hooks/useLanguage.ts";

const FriendsList = (props: {
	getter: Friendship | null;
	setter: (toSet: Friendship | null) => void;
	socket?: WebSocket | null;
}) => {
	const { getter: friends } = props;

	const online: FriendCardType[] = friends ? friends?.online : [];
	const offline: FriendCardType[] = friends ? friends?.offline : [];

	return createElement(
		"div",
		{ class: list_friends },
		createElement("h2", { class: "text-[35px]" }, useLanguage("friend_list")),
		List(
			{},
			FriendCard,
			online?.map((elem) => (elem = { ...elem, active: true }))
		),
		List(
			{},
			FriendCard,
			offline?.map((elem) => (elem = { ...elem, active: false }))
		),
		FormFriend(props)
	);
};

export default FriendsList;
