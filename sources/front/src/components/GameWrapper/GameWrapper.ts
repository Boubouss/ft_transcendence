import { useEffect } from "#core/framework.ts";
import { createElement } from "#core/render.ts";
import { wrapper_container } from "./style";
import Game from "#components/Game/Game.ts";
import _ from "lodash";

import type {
  GameUrlState,
  PlayerState,
  ScoresState,
} from "#pages/Multiplayer/Multiplayer.ts";

type Props = {
  gameSocketRef: { current: WebSocket | null };
  gameUrlState: GameUrlState;
  scoresState: ScoresState;
  playerState: PlayerState;
};

const GameWrapper = ({
  gameSocketRef,
  gameUrlState,
  scoresState,
  playerState,
}: Props) => {
  const [gameUrl, setGameUrl] = gameUrlState;
  const [scores, setScores] = scoresState;
  const [player, setPlayer] = playerState;

  useEffect(() => {
    if (!gameUrl) return;

    gameSocketRef.current = new WebSocket(gameUrl);
    gameSocketRef.current.onclose = () => clearGame();
  }, [gameUrl]);

  useEffect(() => {
    if (!gameSocketRef.current) return;

    setPlayer({
      socket: gameSocketRef.current,
      control: new Map([
        ["ArrowUp", "up"],
        ["ArrowDown", "down"],
      ]),
      input: [],
    });

    return () => {
      gameSocketRef.current!.close();
    };
  }, [gameSocketRef]);

  const clearGame = () => {
    setScores([0, 0]);
    setGameUrl(null);
    setPlayer(null);
    gameSocketRef.current = null;
  };

  return createElement(
    "div",
    { class: wrapper_container },
    player && Game({ scores, setScores, players: [player] })
  );
};

export default GameWrapper;
