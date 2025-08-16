import Game from "./Game/Game";
import LocalForm from "#components/Forms/FormLocal/FormLocal.ts";
import NavigationBar from "#components/NavigationBar/NavigationBar.ts";
import type { LocalConfig, LocalTournament } from "#types/local";
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

async function createGame(
  score: number,
  setSockets: (toSet: WebSocket[]) => void
) {
  const id = `local-${crypto.randomUUID()}`;
  const players = ["P1", "P2"];
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
  const [sockets, setSockets] = useState<WebSocket[]>([]); //todo: change "state" to "ref"
  const [scores, setScores] = useState<number[]>([0, 0]);

  useEffect(() => {
    const handler = () => {
      sockets.forEach((s) => s.close());
      setSockets([]);
      setTournament(null);
      setConfig(null);
      setScores([0, 0]);
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  useEffect(() => {
    if (!config) return;
    setTournament({
      id: crypto.randomUUID(),
      stage: config.mode === "versus" ? "game" : "queue",
      players: [...config.players],
      score: config.score,
      queue: config.mode === "versus" ? [] : [...config.players],
      current:
        config.mode === "versus"
          ? [...(config.players as [string, string])]
          : null,
    });
  }, [config]);

  useEffect(() => {
    if (!config || !tournament) return;

    if (tournament.stage === "game") {
      createGame(config.score, setSockets);
      return;
    }

    if (tournament.stage === "queue" && tournament.queue.length === 1) {
      setTournament({
        ...tournament,
        stage: "finished",
      });
      return;
    }

    if (tournament.stage === "queue" && tournament.queue.length >= 2) {
      const handler = () => {
        const [p1, p2, ...rest] = tournament.queue;
        setTournament({
          ...tournament,
          stage: "game",
          queue: rest,
          current: [p1, p2],
        });
      };
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
  }, [tournament?.stage, tournament?.queue]);

  //todo: improve the game cleanup
  useEffect(() => {
    if (!config || !tournament) return;
    if (scores.includes(config?.score)) {
      const winner =
        config.score === scores[0]
          ? tournament.current![0]
          : tournament.current![1];
      sockets.forEach((s) => s.close());
      setScores([0, 0]);
      setSockets([]);
      setTournament({
        ...tournament,
        stage: "queue",
        current: null,
        queue: [...tournament.queue, winner],
      } as LocalTournament);
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

      tournament?.stage === "queue"
        ? createElement(
            "div",
            { class: `${tournamentTreeStyle} white-space` },
            createElement("div", {}, `${tournament.queue.slice(0, 2)}`),
            createElement("div", {}, `${tournament.queue.slice(2)}`)
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
            `The winner is: ${tournament.queue[0]}`
          )
        : null
    )
  );
};

export default Local;
