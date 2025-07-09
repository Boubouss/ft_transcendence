import { createElement } from "#src/core/render.ts";
import { btn_default } from "./style";

const Button = (props: any = { class: btn_default }, text: string = "btn") => {
	if (!props.class) props.class = btn_default;
	return createElement("button", props, text);
};

export default Button;
