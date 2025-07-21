import { createElement, type ComponentAttr } from "#core/framework";
import { submit_default } from "./style";

const Submit = (props: { text: string; attr?: ComponentAttr }) => {
	let { text, attr } = props;
	const default_attr = { class: submit_default };
	attr = { ...default_attr, ...attr };
	return createElement("div", attr, text);
};

export default Submit;
