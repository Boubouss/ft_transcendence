import { createElement } from "#core/render.ts";
import { useEffect } from "#core/framework.ts";
import { wrapper_container } from "./style";
import Game from "#components/Game/Game.ts";
import _ from "lodash";

import type {
  GameUrlState,
  PlayerState,
  ScoresState,
} from "#pages/Multiplayer/Multiplayer.ts";

type Props = {
  userId: number;
  playerIdName?: Map<string, string>;
  gameSocketRef: { current: WebSocket | null };
  gameUrlState: GameUrlState;
  scoresState: ScoresState;
  playerState: PlayerState;
};

const GameWrapper = ({
  userId,
  playerIdName,
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
  }, [gameUrl]);

  useEffect(() => {
    if (!gameSocketRef.current) return;

    setPlayer({
      id: userId,
      socket: gameSocketRef.current,
      control: new Map([
        ["ArrowUp", "up"],
        ["ArrowDown", "down"],
      ]),
      input: [],
    });

    gameSocketRef.current.onclose = () => clearGame();

    return () => {
      if (!gameSocketRef.current) return;

      gameSocketRef.current.close();
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
    player &&
      Game({
        id: gameUrl!,
        playerIdName,
        scores,
        setScores,
        players: [player],
        isRemote: true,
      })
  );
};

export default GameWrapper;
