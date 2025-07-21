import FormLobby from "#components/Forms/FormLobby/FormLobby.ts";
import Modal from "../Modal";

type Props = {
  showModalState: [boolean, (value: boolean) => void];
  lobbySocket: WebSocket | null;
};

const ModalLobby = ({ showModalState, lobbySocket }: Props) => {
  const [showModal, setShowModal] = showModalState;

  return Modal(
    { state: showModal, setter: setShowModal },
    FormLobby({ showModalState, lobbySocket }),
  );
};

export default ModalLobby;
