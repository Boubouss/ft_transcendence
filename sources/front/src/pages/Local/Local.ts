import Friends from "#components/Friends/Friends.ts";
import FriendList from "#components/Lists/FriendsList/FriendsList.ts";
import { createElement } from "#core/render.ts";
import { home_background } from "#pages/Home/style.ts";

const Local = () => {
	return createElement(
		"div",
		{ class: home_background + " flex justify-center items-center" },
		Friends(FriendList)
	);
};

export default Local;
