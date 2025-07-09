import { createElement, type ComponentAttr } from "#src/core/framework";
import { input_default, label_default } from "./style";

const Input = (props: { attr: ComponentAttr; labelAttr?: ComponentAttr }) => {
	let { attr, labelAttr } = props;

	const default_attr = { class: input_default };
	const default_label_attr = { class: label_default };

	attr = { ...default_attr, ...attr };
	labelAttr = { ...default_label_attr, ...labelAttr };

	return createElement("label", labelAttr, createElement("input", attr));
};

export default Input;
