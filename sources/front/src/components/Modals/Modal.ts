import {
	createElement,
	type Component,
	type ComponentAttr,
} from "#src/core/framework";
import { modal_background, modal_default } from "./style";

const Modal = (
	props: {
		state: boolean;
		setter: (setState: boolean) => void;
		attr?: ComponentAttr;
	},
	children: Component
) => {
	let { state, setter, attr } = props;

	const default_attr = { class: modal_default };

	attr = { ...default_attr, ...attr };

	if (state)
		return createElement(
			"div",
			null,
			createElement("div", {
				class: modal_background,
				onClick: () => setter(!state),
			}),
			createElement("div", attr, children)
		);
	return createElement("div", { class: `hidden` });
};

export default Modal;
