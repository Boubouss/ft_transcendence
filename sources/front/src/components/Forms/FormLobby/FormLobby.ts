import CustomToggle from "#components/Inputs/CustomToggle/CustomToggle.ts";
import { requestLobbyCreation } from "#sockets/Lobby/requests.ts";
import Submit from "#components/Inputs/Submit/Submit.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import Input from "#components/Inputs/Input.ts";
import { createElement } from "#core/render.ts";
import Form from "../Form";

import {
  cancel_button,
  create_button,
  lobby_form,
  lobby_form_content,
  lobby_form_header,
} from "./style";
import Button from "#components/Buttons/Button.ts";

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
      createElement(
        "div",
        { class: "flex flex-col gap-[20px]" },
        Input({
          attr: {
            type: "text",
            name: "name",
            placeholder: useLanguage("name"),
            maxlength: 30,
          },
        }),
        Input({
          attr: {
            type: "number",
            name: "player_limit",
            placeholder: useLanguage("nbr_players"),
            min: 2,
            value: 2,
          },
          labelContent: `${useLanguage("player_limit")} :`,
        }),
        createElement(
          "div",
          { class: "flex items-center gap-[10px]" },
          `${useLanguage("tournament_mode")} :`,
          CustomToggle({ InputAttr: { name: "is_tournament" } })
        )
      ),
      createElement(
        "div",
        { class: "flex justify-end" },
        Submit({
          text: useLanguage("create"),
          attr: { class: create_button, onClick: handleSubmit },
        }),
        Button({
          children: useLanguage("cancel"),
          attr: { class: cancel_button, onClick: () => setShowModal(false) },
        })
      )
    )
  );
};

export default FormLobby;
