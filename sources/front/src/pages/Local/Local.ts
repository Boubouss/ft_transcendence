import NavigationBar from "#components/NavigationBar/NavigationBar.ts";
import { createElement } from "#core/render.ts";
import { home_background } from "#pages/Home/style.ts";
import { useEffect } from "#core/hooks/useEffect";
import { useState } from "#core/hooks/useState";
import Game from "./Game/Game";
import LocalForm from "./Form/Form";
import type { GameConfig, GameStage } from "./type";
import { tournamentTreeStyle } from "./style";

const PORT = 3001;

function isSocketsReady(sockets: WebSocket[]) {
  return (
    sockets.length === 2 &&
    sockets.every(
      (socket) =>
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
    )
  );
}

async function createGame(id: string, players: string[], score: number) {
  return await fetch(`http://localhost:${PORT}/games`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gameId: id, playersId: players, scoreMax: score }),
  });
}

async function handleVersus(
  config: GameConfig,
  setSockets: (toSet: WebSocket[]) => void,
  setStage: (toSet: GameStage) => void
) {
  if (!config) return; //todo: add an error
  await createGame(config.id, ["0", "1"], config.score);
  const sockets = [
    new WebSocket(`ws://localhost:${PORT}/ws/${config.id}/0`),
    new WebSocket(`ws://localhost:${PORT}/ws/${config.id}/1`),
  ];
  setSockets(sockets);
  setStage("game");
}

async function handleTournament() {}

const Local = () => {
  const [config, setConfig] = useState<GameConfig>(null);
  const [scores, setScores] = useState<number[]>([0, 0]);
  const [sockets, setSockets] = useState<WebSocket[]>([]);
  const [stage, setStage] = useState<GameStage>(null);

  useEffect(async () => {
    if (!config) return;
    if (config.mode === "tournament") handleTournament();
    else if (config.mode === "versus")
      handleVersus(config, setSockets, setStage);
  }, [config]);

  //todo: improve the game cleanup
  useEffect(() => {
    if (!config) return;
    if (scores.includes(config?.score)) {
      setStage(null);
      setConfig(null);
      setSockets([]);
      setScores([0, 0]);
    }
  }, [scores]);

  //todo: move this out of the component?
  const playerOne = {
    socket: sockets[0],
    control: new Map([
      ["w", "up"],
      ["s", "down"],
    ]),
    input: [],
  };
  const playerTwo = {
    socket: sockets[1],
    control: new Map([
      ["ArrowUp", "up"],
      ["ArrowDown", "down"],
    ]),
    input: [],
  };

  return createElement(
    "div",
    { class: `${home_background} items-center justify-center` },
    !config ? LocalForm({ config: config, setConfig: setConfig }) : null,

    config && stage === "tree"
      ? createElement("div", { class: tournamentTreeStyle }, "tree placeholder")
      : null,

    config && stage === "game" && isSocketsReady(sockets)
      ? Game({
          id: config.id,
          scores: scores,
          players: [playerOne, playerTwo],
          setScores: setScores,
        })
      : null
  );
};

export default Local;
