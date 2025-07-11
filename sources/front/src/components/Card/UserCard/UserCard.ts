import { dropdown_user_img } from "#components/Dropdowns/style.ts";
import type { ComponentAttr } from "#core/framework.ts";
import { createElement } from "#core/render.ts";
import _ from "lodash";
import { dual_score, player_info, score_match } from "../style";
import Card from "../Card";

const UserCard = (props: {
	name: string;
	avatar: string;
	score: number;
	attr?: ComponentAttr;
}) => {
	let { name, avatar, score, attr } = props;

	const attr_default = { class: dual_score };

	attr = { ...attr_default, ...attr };

	return Card(
		attr,
		createElement(
			"div",
			{ class: player_info },
			createElement("img", {
				src: _.isEmpty(avatar)
					? "../../../../public/images/avatar_1.jpg"
					: avatar,
				class: dropdown_user_img,
			}),
			createElement("span", {}, name)
		),
		createElement("span", { class: score_match }, `${score}`)
	);
};

export default UserCard;
