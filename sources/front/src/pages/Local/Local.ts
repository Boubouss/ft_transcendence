import Game from "./Game/Game";
import LocalForm from "#components/Forms/FormLocal/FormLocal.ts";
import NavigationBar from "#components/NavigationBar/NavigationBar.ts";
import type { LocalConfig, LocalTournament } from "#types/local";
import { createElement } from "#core/render.ts";
import { home_background } from "#pages/Home/style.ts";
import { mainBodyStyle, tournamentTreeStyle } from "./style";
import { useEffect } from "#core/hooks/useEffect";
import { useState } from "#core/hooks/useState";

//todo: add a way to cleanup the game if the url change

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

async function createGame(
  score: number,
  setSockets: (toSet: WebSocket[]) => void
) {
  const id = `local-${crypto.randomUUID()}`;
  const players = ["0", "1"];
  await fetch(`http://localhost:${PORT}/games`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gameId: id, playersId: players, scoreMax: score }),
  });
  const sockets = [
    new WebSocket(`ws://localhost:${PORT}/ws/${id}/${players[0]}`),
    new WebSocket(`ws://localhost:${PORT}/ws/${id}/${players[1]}`),
  ];
  setSockets(sockets);
}

const Local = () => {
  const [config, setConfig] = useState<LocalConfig>(null);
  const [tournament, setTournament] = useState<LocalTournament>(null);
  const [sockets, setSockets] = useState<WebSocket[]>([]);
  const [scores, setScores] = useState<number[]>([0, 0]);

  useEffect(() => {
    if (!config) return;
    setTournament({
      id: crypto.randomUUID(),
      stage: config.mode === "versus" ? "game" : "tree",
      players: [...config.players],
      score: config.score,
    });
  }, [config]);

  useEffect(() => {
    if (!config || !tournament) return;
    if (tournament.stage === "game") {
      createGame(config.score, setSockets);
      return;
    }

    if (tournament.stage === "tree") {
      const handler = () => setTournament({ ...tournament, stage: "game" });
      window.addEventListener("keydown", handler, { once: true });
      return () => window.removeEventListener("keydown", handler);
    }

    if (tournament.stage === "finished") {
      const handler = () => {
        setConfig(null);
        setTournament(null);
      };
      window.addEventListener("keydown", handler, { once: true });
      return () => window.removeEventListener("keydown", handler);
    }
  }, [tournament?.stage]);

  //todo: improve the game cleanup
  useEffect(() => {
    if (!config) return;
    if (scores.includes(config?.score)) {
      sockets.forEach((s) => s.close());
      setScores([0, 0]);
      setSockets([]);
      setTournament({ ...tournament, stage: "finished" } as LocalTournament);
    }
  }, [scores]);

  useEffect(() => {
    return () => sockets.forEach((s) => s.close());
  }, [sockets]);

  const playerOne = {
    control: new Map([
      ["w", "up"],
      ["s", "down"],
    ]),
    input: [],
  };
  const playerTwo = {
    control: new Map([
      ["ArrowUp", "up"],
      ["ArrowDown", "down"],
    ]),
    input: [],
  };
  return createElement(
    "div",
    { class: `${home_background}` },
    NavigationBar({}),
    createElement(
      "div",
      { class: mainBodyStyle },

      !config && !tournament
        ? LocalForm({ config: config, setConfig: setConfig })
        : null,

      tournament?.stage === "tree"
        ? createElement(
            "div",
            { class: `${tournamentTreeStyle} white-space` },
            "tree placeholder"
          )
        : null,

      tournament?.stage === "game" && isSocketsReady(sockets)
        ? Game({
            id: `local-${crypto.randomUUID()}`,
            players: [
              { ...playerOne, socket: sockets[0] },
              { ...playerTwo, socket: sockets[1] },
            ],
            scores: scores,
            setScores: setScores,
          })
        : null,

      tournament?.stage === "finished"
        ? createElement(
            "div",
            { class: `${tournamentTreeStyle} white-space` },
            "end placeholder"
          )
        : null
    )
  );
};

export default Local;
