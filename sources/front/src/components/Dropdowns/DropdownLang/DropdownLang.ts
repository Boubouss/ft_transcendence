import { useState, type ComponentAttr } from "#src/core/framework.ts";
import Button from "#src/components/Buttons/Button.ts";
import List from "#src/components/Lists/List.ts";
import Dropdown from "../Dropdown";
import { btn_list } from "#src/components/Buttons/style.ts";
import { dropdown_content, dropdown_default } from "../style";

const DropdownLang = (props: {
	attr?: ComponentAttr;
	attrContent?: ComponentAttr;
}) => {
	const [language, setLanguage] = useState("FR");

	let { attr, attrContent } = props;

	const default_attr = { class: dropdown_default };
	const default_attr_content = { class: dropdown_content };

	attr = { ...default_attr, ...attr };
	attrContent = { ...default_attr_content, ...attrContent };

	return Dropdown(
		{ btn: { children: language }, attr },
		Button,
		List({ attr: attrContent }, Button, [
			{
				children: "FR",
				attr: {
					class: btn_list + " rounded-t-[20px]",
					onClick: () => setLanguage("FR"),
				},
			},
			{
				children: "EN",
				attr: {
					class: btn_list,
					onClick: () => setLanguage("EN"),
				},
			},
			{
				children: "ES",
				attr: {
					class: btn_list + " rounded-b-[20px]",
					onClick: () => setLanguage("ES"),
				},
			},
		])
	);
};

export default DropdownLang;
