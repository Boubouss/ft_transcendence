import type { ComponentAttr, ComponentProps } from "#src/core/render.ts";
import Button from "../Button";
import { btn_modal } from "../style";

const ButtonModal = (props: {
	text: string;
	state: boolean;
	setter: (toSet: boolean) => void;
	attr?: ComponentAttr;
}) => {
	let { text, state, setter, attr } = props;
	if (!attr) attr = { class: btn_modal, onClick: () => setter(!state) };
	if (!attr.onClick) attr.onClick = () => setter(!state);
	if (!attr.class) attr.class = btn_modal;
	return Button({ text, attr });
};

export default ButtonModal;
