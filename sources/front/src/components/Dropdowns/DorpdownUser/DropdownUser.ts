import {
	createElement,
	navigateTo,
	type ComponentAttr,
} from "#src/core/framework.ts";
import Button from "#src/components/Buttons/Button.ts";
import List from "#src/components/Lists/List.ts";
import Dropdown from "../Dropdown";
import { handleDeconnexion } from "#src/requests/authRequest.ts";
import { btn_list, btn_user } from "#src/components/Buttons/style.ts";
import {
	dropdown_content,
	dropdown_default,
	dropdown_user_img,
} from "../style";

const DropdownUser = (props: {
	state: {
		user: {};
		setUser: (toSet: {} | null) => void;
	};
	attr?: ComponentAttr;
	attrContent?: ComponentAttr;
}) => {
	let { state, attr, attrContent } = props;
	let { user, setUser } = state;

	const default_attr = { class: dropdown_default };
	const default_attr_content = { class: dropdown_content };

	attr = { ...default_attr, ...attr };
	attrContent = { ...default_attr_content, ...attrContent };

	return Dropdown(
		{
			btn: {
				children: createElement(
					"span",
					{ class: btn_user },
					createElement("img", {
						src: "../../../../public/images/avatar_1.jpg",
						class: dropdown_user_img,
					}),
					`${user?.name}`
				),
			},
		},
		Button,
		List({}, Button, [
			{
				children: "Account",
				attr: {
					class: btn_list + " rounded-t-[20px]",
					onClick: () => navigateTo("/account"),
				},
			},
			{
				children: "Carreer",
				attr: {
					class: btn_list,
					onClick: () => navigateTo("/stats"),
				},
			},
			{
				children: "Deconnexion",
				attr: {
					class: btn_list + " rounded-b-[20px]",
					onClick: () => {
						handleDeconnexion(setUser);
					},
				},
			},
		])
	);
};

export default DropdownUser;
