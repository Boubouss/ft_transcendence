import {
	createElement,
	type Component,
	type ComponentAttr,
} from "#core/framework";
import { btn_default } from "./style";

const Button = (props: {
	children: string | Component;
	attr?: ComponentAttr;
}) => {
	let { children, attr } = props;

	const default_attr = { class: btn_default };

	attr = { ...default_attr, ...attr };

	return createElement("button", attr, children ?? "btn");
};

export default Button;
