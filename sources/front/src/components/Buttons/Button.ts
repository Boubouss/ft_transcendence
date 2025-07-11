import { createElement, type ComponentProps } from "#src/core/render.ts";
import { btn_default } from "./style";

const Button = (props: ComponentProps) => {
	let { text, attr } = props;

	const default_attr = { class: btn_default };

	attr = { ...default_attr, ...attr };

	return createElement("button", attr, text ?? "btn");
};

export default Button;
