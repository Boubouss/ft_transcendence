import type { MatchState } from "#pages/Multiplayer/Multiplayer.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import { createElement } from "#core/render.ts";
import type { MatchPlayer } from "#types/match.ts";
import type { User } from "#types/user.ts";
import Modal from "../Modal";
import _ from "lodash";
import { useEffect, useState } from "#core/framework.ts";
import PlayerCard from "#components/Card/PlayerCard/PlayerCard.ts";
import List from "#components/Lists/List.ts";

import {
  modal_container,
  modal_content,
  modal_header,
  ops_list,
  player_container,
} from "./style";

type Props = {
  user: User | null;
  matchState: MatchState;
};

const ModalGameResult = ({ user, matchState }: Props) => {
  const [match, setMatch] = matchState;
  const [currentPlayer, setCurrentPlayer] = useState<MatchPlayer | null>(null);

  useEffect(() => {
    if (_.isEmpty(match) || _.isEmpty(user)) return;

    const player = match.players.find((p) => p.player_id === user.id);

    setCurrentPlayer(player ?? null);
  }, [match, user]);

  const handleClose = (_show: boolean) => {
    setMatch(null);
  };

  return Modal(
    {
      attr: { class: modal_container },
      state: !_.isEmpty(match),
      setter: handleClose,
    },
    !_.isEmpty(match) &&
      !_.isEmpty(currentPlayer) &&
      createElement(
        "template",
        null,
        createElement(
          "div",
          { class: modal_header },
          useLanguage("match_result")
        ),
        createElement(
          "div",
          { class: modal_content },
          createElement(
            "div",
            {
              class: player_container,
            },
            PlayerCard({
              player: currentPlayer.player,
              lobbySocket: null,
              isWaitingRoom: true,
              score: currentPlayer.score,
              isWinner: match.winner_id === currentPlayer.player_id,
            })
          ),
          createElement("img", {
            class: "w-[50px]",
            src: "/icons/versus.png",
          }),
          List(
            {
              attr: { class: ops_list },
            },
            PlayerCard,
            match!.players
              .map((p) => {
                if (p.player_id !== currentPlayer.player_id) {
                  return {
                    player: p.player,
                    lobbySocket: null,
                    isWaitingRoom: true,
                    score: p.score,
                    isWinner: match.winner_id === p.player_id,
                  };
                }
              })
              .filter((v) => v)
          )
        ),
        createElement(
          "div",
          { class: "flex p-[10px] w-full justify-center text-5xl" },
          match.winner_id === currentPlayer.player_id
            ? createElement(
                "p",
                { class: "text-green-500 my-text-shadow" },
                useLanguage("win_message")
              )
            : createElement(
                "p",
                { class: "text-red-500 my-text-shadow" },
                useLanguage("loss_message")
              )
        )
      )
  );
};

export default ModalGameResult;
