import FormAuth from "#src/components/Forms/FormAuth/FormAuth.ts";
import Modal from "../Modal";

const ModalConnexion = (state: boolean, setter: () => void) => {
	return Modal(state, setter, FormAuth());
};

export default ModalConnexion;
