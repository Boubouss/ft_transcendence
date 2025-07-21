import LobbyCard from "#components/Card/LobbyCard/LobbyCard.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import Button from "#components/Buttons/Button.ts";
import { createElement } from "#core/render.ts";
import type { Lobby } from "#types/lobby.ts";
import * as style from "./style";
import List from "../List";
import _ from "lodash";

type Props = {
  lobbies: Lobby[];
  currentLobby: Lobby | null;
  showModalState: [boolean, (value: boolean) => void];
};

const LobbyList = ({ lobbies, currentLobby, showModalState }: Props) => {
  const [, setShowModal] = showModalState;

  const handleJoinLobby = (lobby: Lobby) => {
    console.log(lobby);
  };

  return createElement(
    "div",
    { class: style.lobby_container },
    createElement(
      "div",
      { class: "flex w-full" },
      createElement(
        "h1",
        { class: "underline text-4xl m-auto" },
        useLanguage("lobby_list"),
      ),
      Button({
        children: `${useLanguage("create_new_lobby")} +`,
        attr: {
          class: style.create_lobby_button,
          onClick: () => setShowModal(true),
        },
      }),
    ),
    !_.isEmpty(lobbies)
      ? List(
          { attr: { class: style.lobby_list_container } },
          LobbyCard,
          lobbies.map((lobby) => {
            return { lobby, handleJoinLobby };
          }),
        )
      : createElement(
          "div",
          { class: style.lobby_list_container },
          createElement(
            "p",
            { class: "m-auto text-3xl" },
            useLanguage("no_lobby"),
          ),
        ),
  );
};

export default LobbyList;
