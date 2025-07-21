import Button from "#components/Buttons/Button.ts";
import { createElement } from "#core/render.ts";
import type { Lobby } from "#types/lobby.ts";
import Card from "#components/Card/Card.ts";
import * as style from "./style";

type LobbyCardProps = {
  lobby: Lobby
  handleJoinLobby: (value: Lobby) => void
}

const LobbyCard = (props: LobbyCardProps) => {
  return Card({ class: style.lobby_card },
    createElement("div", { class: "flex flex-1 gap-[10px] truncate items-center" },
      createElement("img", { class: style.lobby_card_img, src: props.lobby.is_tournament ? "/icons/pong_tournament.png" : "/icons/pong.png" }),
      createElement("p", { class: "flex-1 text-4xl truncate" }, props.lobby.name)
    ),
    createElement("div", { class: "flex flex-col justify-center gap-[5px]" },
      createElement("div", { class: "flex items-center gap-[5px]" },
        createElement("img", { src: "icons/friends_icon.png", class: "h-[18px]" }),
        createElement("p", { class: "text-2xl" },
          `${props.lobby.players.length}/${props.lobby.player_limit}`
        )
      ),
      Button({ children: "Join", attr: { class: style.join_button, onClick: () => props.handleJoinLobby(props.lobby) } }),
    )
  )
};

export default LobbyCard;
