import Button from "../Button";
import { btn_modal } from "../style";

const ButtonModal = (
	text: string,
	state: boolean,
	setter: (toSet: boolean) => void,
	props: any = { class: btn_modal }
) => {
	return Button(text, { class: props.class, onClick: () => setter(!state) });
};

export default ButtonModal;
