import Button from "#components/Buttons/Button.ts";
import PlayerCard from "#components/Card/PlayerCard/PlayerCard.ts";
import List from "#components/Lists/List.ts";
import { createElement } from "#core/render.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import { requestAction } from "#sockets/Lobby/requests.ts";
import { Action, type Lobby } from "#types/lobby.ts";
import type { User } from "#types/user.ts";
import * as style from "./style";
import _ from "lodash";

type Props = {
  user: User;
  currentLobby: Lobby;
  lobbySocket: WebSocket | null;
  handleLeave: () => void;
};

const LobbyInfos = ({
  user,
  currentLobby,
  lobbySocket,
  handleLeave,
}: Props) => {
  const isUserAdmin = currentLobby.id === user.id;
  const isUserReady = currentLobby.ready_ids.includes(user.id as number);
  const isAllReady = currentLobby.ready_ids.length >= currentLobby.player_limit;

  const handleReadyUp = () => {
    requestAction(lobbySocket, Action.SWITCH_READY, currentLobby.id);
  };

  const handleLaunch = () => {
    requestAction(lobbySocket, Action.LAUNCH, currentLobby.id);
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
    createElement(
      "div",
      { class: "relative w-full h-full" },
      List(
        { attr: { class: style.lobby_infos_container } },
        PlayerCard,
        currentLobby.players.map((player) => {
          return {
            player,
            lobbySocket,
            currentLobby,
            isReady: currentLobby.ready_ids.includes(player.id),
            isPlayerAdmin: currentLobby.id === player.id,
            isUserAdmin,
          };
        })
      )
    ),
    createElement(
      "div",
      { class: "flex w-full gap-[5px] justify-center" },
      isUserAdmin &&
        Button({
          children: createElement(
            "template",
            null,
            createElement("img", {
              class: "w-[35px] h-[35px] m-auto",
              src: "/icons/dual_icon.png",
            }),
            createElement(
              "span",
              { class: "pl-1" },
              currentLobby.is_tournament
                ? useLanguage("launch_tournament")
                : useLanguage("launch_game")
            )
          ),
          attr: {
            class: style.launch_button({
              isDisabled: !isAllReady,
            }),
            onClick: handleLaunch,
            disabled: !isAllReady,
          },
        }),
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
