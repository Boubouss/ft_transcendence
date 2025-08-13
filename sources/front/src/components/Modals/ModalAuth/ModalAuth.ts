import FormAuth from "#components/Forms/FormAuth/FormAuth.ts";
import Modal from "../Modal";

const ModalAuth = (state: boolean, setter: () => void) => {
  return Modal(state, setter, FormAuth());
};

export default ModalAuth;
