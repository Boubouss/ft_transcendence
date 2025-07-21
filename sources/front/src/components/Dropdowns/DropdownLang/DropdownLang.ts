import {
	useEffect,
	useState,
	type ComponentAttr,
} from "#core/framework.ts";
import Button from "#components/Buttons/Button.ts";
import List from "#components/Lists/List.ts";
import Dropdown from "../Dropdown";
import { btn_list } from "#components/Buttons/style.ts";
import { dropdown_content, dropdown_default } from "../style";
import { getStorage, setStorage } from "#services/data.ts";
import { handleLang } from "#services/language.ts";

const DropdownLang = (props: {
	attr?: ComponentAttr;
	attrContent?: ComponentAttr;
}) => {
	const [language, setLanguage] = useState("FR");

	let { attr, attrContent } = props;

	const default_attr = { class: dropdown_default + " w-[96px]" };
	const default_attr_content = { class: dropdown_content + " w-[96px]" };

	attr = { ...default_attr, ...attr };
	attrContent = { ...default_attr_content, ...attrContent };

	useEffect(() => {
		const configuration = getStorage(localStorage, "transcendence_conf");
		if (configuration?.lang) setLanguage(configuration.lang);
		else {
			setStorage(localStorage, "transcendence_conf", {
				lang: "FR",
				...configuration,
			});
			setLanguage("FR");
		}
	}, []);

	return Dropdown(
		{ btn: { children: language }, attr },
		Button,
		List({ attr: attrContent }, Button, [
			{
				children: "FR",
				attr: {
					class: btn_list + " rounded-t-[20px]",
					onClick: () => handleLang("FR", setLanguage),
				},
			},
			{
				children: "EN",
				attr: {
					class: btn_list,
					onClick: () => handleLang("EN", setLanguage),
				},
			},
			{
				children: "ES",
				attr: {
					class: btn_list + " rounded-b-[20px]",
					onClick: () => handleLang("ES", setLanguage),
				},
			},
		])
	);
};

export default DropdownLang;
