import {
	createElement,
	navigateTo,
	type ComponentAttr,
} from "#core/framework.ts";
import Button from "#components/Buttons/Button.ts";
import List from "#components/Lists/List.ts";
import Dropdown from "../Dropdown";
import { handleDeconnexion } from "#requests/authRequest.ts";
import { btn_list, btn_user } from "#components/Buttons/style.ts";
import {
	dropdown_content,
	dropdown_default,
	dropdown_user_img,
} from "../style";
import { useLanguage } from "#hooks/useLanguage.ts";

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

	const default_attr = { class: dropdown_default + " w-[220px]" };
	const default_attr_content = { class: dropdown_content + " w-[220px]" };

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
			attr,
		},
		Button,
		List({ attr: attrContent }, Button, [
			{
				children: useLanguage("myacc"),
				attr: {
					class: btn_list + " rounded-t-[20px]",
					onClick: () => navigateTo("/account"),
				},
			},
			{
				children: useLanguage("career"),
				attr: {
					class: btn_list,
					onClick: () => navigateTo("/stats"),
				},
			},
			{
				children: useLanguage("logout"),
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
