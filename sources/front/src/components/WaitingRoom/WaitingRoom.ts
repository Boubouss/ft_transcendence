import PlayerCard from "#components/Card/PlayerCard/PlayerCard.ts";
import List from "#components/Lists/List.ts";
import { createElement } from "#core/render.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import type { Player } from "#types/match.ts";
import * as style from "./style.ts";

type Props = {
  nextOpponents: Player[];
  handleLeave: () => void;
};

const WaitingRoom = ({ nextOpponents }: Props) => {
  return createElement(
    "div",
    { class: style.waiting_room_container },
    createElement(
      "div",
      { class: "flex w-full" },
      createElement(
        "h1",
        { class: "underline text-4xl m-auto" },
        useLanguage("waiting_opponents")
      )
    ),
    createElement(
      "div",
      { class: "w-full h-full relative" },
      List(
        { attr: { class: style.next_opponents_container } },
        PlayerCard,
        nextOpponents.map((player) => {
          return {
            player,
            lobbySocket: null,
            isWaitingRoom: true,
          };
        })
      )
    )
  );
};

export default WaitingRoom;
