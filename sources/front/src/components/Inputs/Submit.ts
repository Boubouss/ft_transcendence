import { createElement } from "#src/core/render.ts";
import { submit_default } from "./style";

const Submit = (name: string, props: any = { class: submit_default }) => {
	if (!props.class) props.class = submit_default;
	return createElement("div", props, name);
};

export default Submit;
