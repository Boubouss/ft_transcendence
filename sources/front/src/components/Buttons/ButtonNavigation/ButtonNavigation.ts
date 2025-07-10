import { navigateTo } from "#src/core/router.ts";
import Button from "../Button";
import { btn_menu } from "../style";

const ButtonNavigation = (text: string, path: string) => {
	return Button(text, {
		class: btn_menu,
		onClick: () => navigateTo(`${path}`),
	});
};

export default ButtonNavigation;
