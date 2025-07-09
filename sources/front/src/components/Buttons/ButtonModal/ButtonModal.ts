import Button from "../Button";
import { btn_modal } from "../style";

const ButtonModal = (
	text: string,
	state: boolean,
	setter: (toSet: boolean) => void
) => {
	return Button({ class: btn_modal, onClick: () => setter(!state) }, text);
};

export default ButtonModal;
