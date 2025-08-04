import { lobby_form, lobby_form_content, lobby_form_header } from "./style";
import { requestLobbyCreation } from "#sockets/lobby/requests.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import Input from "#components/Inputs/Input.ts";
import { createElement } from "#core/render.ts";
import Form from "../Form";
import Submit from "#components/Inputs/Submit/Submit.ts";

type Props = {
  showModalState: [boolean, (value: boolean) => void];
  lobbySocket: WebSocket | null;
};

const FormLobby = ({ showModalState, lobbySocket }: Props) => {
  const [_, setShowModal] = showModalState;

  const handleSubmit = () => {
    requestLobbyCreation(lobbySocket);
    setShowModal(false);
  };

  return Form(
    { attr: { id: "form_lobby", class: lobby_form } },
    createElement(
      "div",
      { class: lobby_form_header },
      useLanguage("lobby_creation")
    ),
    createElement(
      "div",
      { class: lobby_form_content },
      Input({
        attr: { type: "number", name: "player_limit", min: 2, value: 2 },
      }),
      Submit({
        text: useLanguage("create"),
        attr: { onClick: handleSubmit },
      })
    )
  );
};

export default FormLobby;
