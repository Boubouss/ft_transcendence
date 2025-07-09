import { useState } from "#src/core/hooks/useState.ts";
import { createElement } from "#src/core/render.ts";
import ButtonModal from "../Buttons/ButtonModal/ButtonModal";
import { dropdown_default } from "./style";

const Dropdown = (
	name: string,
	content: any,
	props: any = { class: dropdown_default }
) => {
	if (!props.class) props.class = dropdown_default;

	const [dropdown, setDropdown] = useState(false);

	return createElement(
		"div",
		props,
		ButtonModal(name, dropdown, setDropdown),
		dropdown ? content : createElement("div", { class: `hidden` })
	);
};

export default Dropdown;
