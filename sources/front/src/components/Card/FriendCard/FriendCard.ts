import Card from "#components/Card/Card.ts";
import { createElement } from "#core/render.ts";
import type { Friend } from "#types/user.ts";
import _ from "lodash";
import { friend_card, friend_card_active, friend_card_inactive } from "./style";

export type FriendCardType = Friend & {
	active?: boolean;
};

const FriendCard = (props: FriendCardType) => {
	const { id, name, avatar, active } = props;
	return Card(
		{ class: friend_card + active ? friend_card_active : friend_card_inactive },
		createElement("img", {
			src: _.isEmpty(avatar) ? "" : avatar,
			class: "rounded",
		}),
		createElement("span", {}, name)
	);
};

export default FriendCard;
