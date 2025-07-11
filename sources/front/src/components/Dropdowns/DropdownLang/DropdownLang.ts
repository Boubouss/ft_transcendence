import Button from "#src/components/Buttons/Button.ts";
import { useState } from "#src/core/hooks/useState.ts";
import { createElement, type ComponentAttr } from "#src/core/render.ts";
import Dropdown from "../Dropdown";
import { dropdown_content, dropdown_default, dropdown_items } from "../style";

const DropdownLang = (props: { attr?: ComponentAttr }) => {
	const [language, setLanguage] = useState("FR");

	let { attr } = props;

	const default_attr = { class: dropdown_default };

	attr = { ...default_attr, ...attr };

	return Dropdown(
		{ text: language, attr },
		createElement(
			"div",
			{ class: dropdown_content },
			Button({
				text: "FR",
				attr: {
					class: dropdown_items + " rounded-t-[20px]",
					onClick: () => setLanguage("FR"),
				},
			}),
			Button({
				text: "EN",
				attr: { class: dropdown_items, onClick: () => setLanguage("EN") },
			}),
			Button({
				text: "ES",
				attr: {
					class: dropdown_items + " rounded-b-[20px]",
					onClick: () => setLanguage("ES"),
				},
			})
		)
	);
};

export default DropdownLang;
