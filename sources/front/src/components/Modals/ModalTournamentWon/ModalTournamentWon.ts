import type { TournamentWonState } from "#pages/Multiplayer/Multiplayer.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import { createElement } from "#core/render.ts";
import type { User } from "#types/user.ts";
import Modal from "../Modal";
import _ from "lodash";

import {
  modal_container,
  modal_content,
  modal_header,
  player_container,
} from "./style";
import { useAvatar } from "#hooks/useAvatar.ts";

type Props = {
  user: User | null;
  tournamentWonState: TournamentWonState;
};

const ModalTournamentWon = ({ user, tournamentWonState }: Props) => {
  const [tournamentWon, setTournamentWon] = tournamentWonState;

  return Modal(
    {
      attr: { class: modal_container },
      state: tournamentWon,
      setter: setTournamentWon,
    },
    !_.isEmpty(user) &&
    createElement(
      "template",
      null,
      createElement(
        "div",
        { class: modal_header },
        useLanguage("tournament_result")
      ),
      createElement(
        "div",
        { class: modal_content },
        createElement(
          "div",
          { class: player_container },
          createElement("img", {
            class: "w-[200px], h-[200px] object-cover",
            src: useAvatar(user.avatar),
          }),
          createElement("img", {
            class:
              "absolute rotate-42 top-[-45px] right-[-40px] w-[90px], h-[90px]",
            src: "/icons/crown.png",
          })
        )
      ),
      createElement(
        "div",
        { class: "flex p-[10px] w-full justify-center text-5xl" },
        createElement(
          "p",
          { class: "text-green-500 my-text-shadow" },
          useLanguage("win_message")
        )
      )
    )
  );
};

export default ModalTournamentWon;
