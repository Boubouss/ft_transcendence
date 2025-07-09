import { navigateTo } from "#src/core/router.ts";
import Button from "../Button";
import { btn_menu } from "../style";

const ButtonMenu = (text: string, path: string) => {
	return Button(
		{ class: btn_menu, onClick: () => navigateTo(`${path}`) },
		text
	);
};

export default ButtonMenu;
