import { createElement } from "#src/core/render.ts";
import { form_default } from "./style";

const Form = (props: any = { class: form_default }, ...inputs: any) => {
	if (!props.class) props.class = form_default;
	return createElement("form", props, ...inputs);
};

export default Form;
