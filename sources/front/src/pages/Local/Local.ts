import Game from "./Game/Game";
import LocalForm from "#components/Forms/FormLocal/FormLocal.ts";
import NavigationBar from "#components/NavigationBar/NavigationBar.ts";
import type { GameConfig, GameStage } from "#types/local";
import { createElement } from "#core/render.ts";
import { home_background } from "#pages/Home/style.ts";
import { mainBodyStyle, tournamentTreeStyle } from "./style";
import { useEffect } from "#core/hooks/useEffect";
import { useState } from "#core/hooks/useState";

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
  if (!config) throw Error; //todo: add an error
  if (!config.players) throw Error; //todo: add an error
  if (config.players.length < 2) throw Error; //todo: add an error

  const id = `local-${crypto.randomUUID()}`;
  await createGame(id, ["0", "1"], config.score);
  const sockets = [
    new WebSocket(`ws://localhost:${PORT}/ws/${id}/${config.players[0]}`),
    new WebSocket(`ws://localhost:${PORT}/ws/${id}/${config.players[1]}`),
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
      setConfig(null);
      setScores([0, 0]);
      setSockets([]);
      setStage(null);
    }
  }, [scores]);

  console.debug(config);
  return createElement(
    "div",
    { class: `${home_background}` },
    NavigationBar({}),
    createElement(
      "div",
      { class: mainBodyStyle },
      !config ? LocalForm({ config: config, setConfig: setConfig }) : null,

      config && stage === "tree"
        ? createElement(
            "div",
            { class: tournamentTreeStyle },
            "tree placeholder"
          )
        : null,

      config && stage === "game" && isSocketsReady(sockets)
        ? Game({
            id: `local-${crypto.randomUUID()}`,
            scores: scores,
            players: [
              {
                socket: sockets[0],
                control: new Map([
                  ["w", "up"],
                  ["s", "down"],
                ]),
                input: [],
              },
              {
                socket: sockets[1],
                control: new Map([
                  ["ArrowUp", "up"],
                  ["ArrowDown", "down"],
                ]),
                input: [],
              },
            ],
            setScores: setScores,
          })
        : null
    )
  );
};

export default Local;
