import CustomToggle from "#components/Inputs/CustomToggle/CustomToggle.ts";
import { requestLobbyCreation } from "#sockets/Lobby/requests.ts";
import Selector from "#components/Inputs/Selector/Selector.ts";
import Submit from "#components/Inputs/Submit/Submit.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import Button from "#components/Buttons/Button.ts";
import { useEffect, useRef, useState } from "#core/framework.ts";
import Input from "#components/Inputs/Input.ts";
import { createElement } from "#core/render.ts";
import Form from "../Form";
import _ from "lodash";

import {
  cancel_button,
  create_button,
  lobby_form,
  lobby_form_content,
  lobby_form_header,
} from "./style";

type Props = {
  showModalState: [boolean, (value: boolean) => void];
  lobbySocket: WebSocket | null;
};

const FormLobby = ({ showModalState, lobbySocket }: Props) => {
  const [_showModal, setShowModal] = showModalState;
  const [score, setScore] = useState(5);
  const [size, setSize] = useState(2);
  const [isTournament, setIsTournament] = useState(false);

  const sizeOptionsRef = useRef(_.range(2, 17));
  const tournamentRef = useRef("false");
  const scoreOptions = _.range(1, 11);

  useEffect(() => {
    if (isTournament) {
      const floor = 1 << Math.log2(size);
      const ceil = floor << 1;

      sizeOptionsRef.current = [4, 8, 16];
      setSize(ceil - size < size - floor || floor < 4 ? ceil : floor);
    } else {
      sizeOptionsRef.current = _.range(2, 17);
      setSize(size);
    }
  }, [isTournament]);

  const handleSubmit = () => {
    requestLobbyCreation(lobbySocket);
    setShowModal(false);
  };

  const handleToggleInput = (event: InputEvent) => {
    const target = event.target as HTMLInputElement;
    if (!target) return;

    tournamentRef.current = target.checked ? "true" : "false";
    setIsTournament(target.checked);
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
        createElement(
          "div",
          null,
          createElement(
            "div",
            { class: `text-center` },
            useLanguage("game_size")
          ),
          Selector({
            values: sizeOptionsRef.current,
            value: size,
            setValue: setSize,
          }),
          createElement("input", {
            type: "hidden",
            name: "player_limit",
            value: `${size}`,
          })
        ),
        createElement(
          "div",
          null,
          createElement(
            "p",
            { class: `text-center` },
            useLanguage("score_round")
          ),
          Selector({
            values: scoreOptions,
            value: score,
            setValue: setScore,
          }),
          createElement("input", {
            type: "hidden",
            name: "score_max",
            value: `${score}`,
          })
        ),
        createElement(
          "div",
          { class: "flex justify-center items-center gap-[10px]" },
          `${useLanguage("tournament_mode")} :`,
          CustomToggle({
            externalValueRef: tournamentRef,
            attr: {
              name: "is_tournament",
              onInput: (e: InputEvent) => handleToggleInput(e),
            },
          })
        )
      ),
      createElement(
        "div",
        { class: "flex justify-end mt-[20px]" },
        Button({
          children: useLanguage("cancel"),
          attr: { class: cancel_button, onClick: () => setShowModal(false) },
        }),
        Submit({
          text: useLanguage("create"),
          attr: { class: create_button, onClick: handleSubmit },
        })
      )
    )
  );
};

export default FormLobby;
