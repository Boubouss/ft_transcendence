import { createElement } from "#core/render.ts";
import Modal from "../Modal";
import { modal_background } from "../style";
import { modal_error } from "./style";

type Props = {
  showModalState: [boolean, (value: boolean) => void];
  Error: string;
};

const ModalError = ({ showModalState, Error }: Props) => {
  const [showModal, setShowModal] = showModalState;

  return Modal(
    {
      state: showModal,
      setter: setShowModal,
      attr: { class: modal_error },
      attrBackground: { class: modal_background + "z-3" },
    },
    createElement(
      "div",
      { class: "text-3xl whitespace-pre-line text-center" },
      Error
    )
  );
};

export default ModalError;
