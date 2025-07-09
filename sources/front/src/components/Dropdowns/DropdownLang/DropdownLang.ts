import Button from "#src/components/Buttons/Button.ts";
import { useState } from "#src/core/hooks/useState.ts";
import { createElement } from "#src/core/render.ts";
import Dropdown from "../Dropdown";
import { dropdown_content, dropdown_default, dropdown_items } from "../style";

const DropdownLang = (props: any = { class: dropdown_default }) => {
	const [language, setLanguage] = useState("FR");

	return Dropdown(
		language,
		createElement(
			"div",
			{ class: dropdown_content },
			Button("FR", {
				class: dropdown_items + " rounded-t-[20px]",
				onClick: () => setLanguage("FR"),
			}),
			Button("EN", { class: dropdown_items, onClick: () => setLanguage("EN") }),
			Button("ES", {
				class: dropdown_items + " rounded-b-[20px]",
				onClick: () => setLanguage("ES"),
			})
		),
		props
	);
};

export default DropdownLang;
