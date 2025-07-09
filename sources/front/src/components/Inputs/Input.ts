import { createElement } from "#src/core/render.ts";
import { input_default, label_default } from "./style";

const Input = (
	type: string,
	name: string,
	props: any = { class: input_default },
	labelProps: any = { class: label_default }
) => {
	if (!props.class) props.class = input_default;
	return createElement(
		"label",
		labelProps,
		createElement("input", { type, name, placeholder: name, ...props })
	);
};

export default Input;
