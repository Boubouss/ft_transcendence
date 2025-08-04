import { createElement } from "#core/render.ts";
import { Action, type Lobby, type LobbyPlayer } from "#types/lobby.ts";
import { requestAction } from "#sockets/lobby/requests.ts";
import Button from "#components/Buttons/Button.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import * as style from "./style.ts";
import Card from "../Card";

type Props = {
  player: LobbyPlayer;
  lobbySocket: WebSocket | null;
  currentLobby: Lobby;
  isReady: boolean;
  isAdmin: boolean;
};

const PlayerCard = ({
  player,
  lobbySocket,
  currentLobby,
  isReady,
  isAdmin,
  canKick,
}: Props) => {
  const handleKick = () => {
    requestAction(lobbySocket, Action.KICK, currentLobby.id, player.id);
  };

  return Card(
    { class: style.player_card },
    createElement(
      "div",
      { class: "flex flex-1 gap-[10px] truncate items-center" },
      createElement("img", {
        class: style.player_card_img,
        src: "/images/avatar_1.jpg",
      }),
      createElement(
        "p",
        { class: "flex flex-1 items-center gap-[10px] text-4xl truncate" },
        isAdmin &&
          createElement("img", {
            class: "w-[20px] h-[20px]",
            src: "/icons/crown.png",
          }),
        createElement("span", null, player.name),
      ),
    ),
    createElement(
      "div",
      { class: "flex items-center gap-[5px]" },
      !isAdmin &&
        canKick &&
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
          `${isReady ? useLanguage("ready") : useLanguage("not_ready")}`,
        ),
      ),
    ),
  );
};

export default PlayerCard;
