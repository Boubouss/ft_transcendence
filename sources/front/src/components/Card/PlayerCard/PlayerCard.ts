import { createElement } from "#core/render.ts";
import { Action, type Lobby, type LobbyPlayer } from "#types/lobby.ts";
import { requestAction } from "#sockets/Lobby/requests.ts";
import Button from "#components/Buttons/Button.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import * as style from "./style.ts";
import Card from "../Card";
import _ from "lodash";
import { useAvatar } from "#hooks/useAvatar.ts";

type Props = {
  player: LobbyPlayer;
  lobbySocket: WebSocket | null;
  currentLobby?: Lobby;
  isReady?: boolean;
  isPlayerAdmin?: boolean;
  isUserAdmin?: boolean;
  isWaitingRoom?: boolean;
  isWinner?: boolean;
  score?: number;
};

const PlayerCard = ({
  player,
  lobbySocket,
  currentLobby,
  isReady,
  isPlayerAdmin,
  isUserAdmin,
  isWaitingRoom,
  isWinner,
  score,
}: Props) => {
  const handleKick = () => {
    if (_.isEmpty(currentLobby)) {
      return console.error("Error: no current lobby.");
    }

    requestAction(lobbySocket, Action.KICK, currentLobby.id, player.id);
  };

  const getEndContent = () => {
    if (typeof score !== "undefined") {
      return createElement(
        "div",
        { class: style.score_container({ isWinner }) },
        score.toString()
      );
    } else if (!isWaitingRoom) {
      return createElement(
        "template",
        null,
        !isPlayerAdmin &&
        isUserAdmin &&
        Button({
          children: useLanguage("kick"),
          attr: {
            class: style.kick_button,
            onClick: handleKick,
          },
        }),
        createElement(
          "div",
          { class: "flex items-center gap-[5px]" },
          createElement("img", {
            src: `/icons/${isReady ? "ready" : "not_ready"}.png`,
            class: "w-[20px] h-[20px]",
          }),
          createElement(
            "p",
            { class: "text-2xl" },
            `${isReady ? useLanguage("ready") : useLanguage("not_ready")}`
          )
        )
      );
    }
  };

  return Card(
    { class: style.player_card },
    createElement(
      "div",
      { class: "flex flex-1 gap-[10px] truncate items-center" },
      createElement("img", {
        class: style.player_card_img,
        src: useAvatar(player.avatar, player.updated_at),
      }),
      createElement(
        "p",
        { class: "flex flex-1 items-center gap-[10px] text-4xl truncate" },
        isPlayerAdmin &&
        createElement("img", {
          class: "ml-[5px] w-[35px] h-[30px]",
          src: "/icons/crown.png",
        }),
        createElement("span", null, player.name)
      )
    ),
    createElement(
      "div",
      { class: "flex items-center gap-[5px]" },
      getEndContent()
    )
  );
};

export default PlayerCard;
