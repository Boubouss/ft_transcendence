import { useState } from "#src/core/hooks/useState.ts";
import {
	createElement,
	type Component,
	type ComponentAttr,
} from "#src/core/render.ts";
import ButtonModal from "../Buttons/ButtonModal/ButtonModal";
import { dropdown_default } from "./style";

const Dropdown = (
	props: {
		text: string;
		attr?: ComponentAttr;
	},
	content: Component
) => {
	let { text, attr } = props;

	const default_attr = { class: dropdown_default };

	attr = { ...default_attr, ...attr };

	const [dropdown, setDropdown] = useState(false);

	return createElement(
		"div",
		attr,
		ButtonModal({ text: text ?? "btn", state: dropdown, setter: setDropdown }),
		dropdown ? content : createElement("div", { class: `hidden` })
	);
};

export default Dropdown;
