import { createElement } from "#src/core/render.ts";
import { modal_background, modal_default } from "./style";

const Modal = (
	state: boolean,
	setter: (setState: boolean) => void,
	children: any,
	props: any = { class: modal_default }
) => {
	if (!props.class) props.class = modal_default;
	if (state)
		return createElement(
			"div",
			null,
			createElement("div", {
				class: modal_background,
				onClick: () => setter(!state),
			}),
			createElement("div", props, children)
		);
	return createElement("div", { class: `hidden` });
};

export default Modal;
