import type { ComponentAttr } from "#src/core/render.ts";
import { navigateTo } from "#src/core/router.ts";
import Button from "../Button";
import { btn_menu } from "../style";

const ButtonNavigation = (props: {
	text: string;
	path: string;
	attr?: ComponentAttr;
}) => {
	let { text, path, attr } = props;

	const default_attr = {
		class: btn_menu,
		onClick: () => navigateTo(`${path}`),
	};
	attr = { ...default_attr, ...attr };

	return Button({ text, attr });
};

export default ButtonNavigation;
