import Button from "#components/Buttons/Button.ts";
import PlayerCard from "#components/Card/PlayerCard/PlayerCard.ts";
import List from "#components/Lists/List.ts";
import { createElement } from "#core/render.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import { requestAction } from "#sockets/lobby/requests.ts";
import { Action, type Lobby } from "#types/lobby.ts";
import type { User } from "#types/user.ts";
import * as style from "./style";
import _ from "lodash";

type Props = {
  user: User | null;
  currentLobby: Lobby;
  lobbySocket: WebSocket | null;
};

const LobbyInfos = ({ user, currentLobby, lobbySocket }: Props) => {
  const isUserReady = currentLobby.ready_ids.includes(user?.id ?? -1);

  const handleLeave = () => {
    requestAction(lobbySocket, Action.LEAVE, currentLobby.id);
  };

  const handleReadyUp = () => {
    requestAction(lobbySocket, Action.SWITCH_READY, currentLobby.id);
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
        currentLobby.name
      ),
      Button({
        children: useLanguage("leave_lobby"),
        attr: {
          class: style.leave_button,
          onClick: handleLeave,
        },
      })
    ),
    !_.isEmpty(user) &&
      createElement(
        "div",
        { class: style.lobby_infos_container },
        List(
          { attr: { class: style.lobby_infos_container } },
          PlayerCard,
          currentLobby.players.map((player) => {
            return {
              player,
              lobbySocket,
              currentLobby,
              isReady: currentLobby.ready_ids.includes(player.id),
              isAdmin: currentLobby.id === player.id,
              canKick: currentLobby.id === user.id,
            };
          })
        )
      ),
    createElement(
      "div",
      { class: "flex w-full h-auto justify-center" },
      Button({
        children: createElement(
          "template",
          null,
          createElement("span", { class: "pr-1" }, useLanguage("ready")),
          createElement("img", {
            class: "w-[20px] h-[20px] m-auto",
            src: isUserReady ? "/icons/checked.png" : "/icons/unchecked.png",
          })
        ),
        attr: {
          class: style.ready_button({
            isReady: isUserReady,
          }),
          onClick: handleReadyUp,
        },
      })
    )
  );
};

export default LobbyInfos;
