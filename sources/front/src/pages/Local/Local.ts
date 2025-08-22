import Game from "#components/Game/Game";
import LocalForm from "#components/Forms/FormLocal/FormLocal.ts";
import NavigationBar from "#components/NavigationBar/NavigationBar.ts";
import _ from "lodash";
import type { LocalConfig, LocalTournament } from "#types/local";
import { createElement } from "#core/render.ts";
import { home_background } from "#pages/Home/style.ts";
import { mainBodyStyle, tournamentTreeStyle } from "./style";
import { useEffect } from "#core/hooks/useEffect";
import { useLanguage } from "#hooks/useLanguage.ts";
import { useState } from "#core/hooks/useState";

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
  await fetch(`${import.meta.env.VITE_API_LOGIC}/games`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gameId: id, playersId: players, scoreMax: score }),
  });
  const sockets = [
    new WebSocket(`${import.meta.env.VITE_LOGIC_WSS}/${id}/${players[0]}`),
    new WebSocket(`${import.meta.env.VITE_LOGIC_WSS}/${id}/${players[1]}`),
  ];
  setSockets(sockets);
}

const GameQueue = (props: { tournament: LocalTournament }) => {
  if (!props.tournament) return null;

  const matchCurrent = props.tournament.queue.slice(0, 2) as [string, string];
  let matchRemaining: string[][] = [];

  const remaining = props.tournament.queue.slice(2);
  for (let i = 0; i < remaining.length; i += 2) {
    let pair = remaining.slice(i, i + 2);
    if (pair.length === 1) pair.push("???");
    matchRemaining.push(pair);
  }

  return createElement(
    "div",
    {
      class: `${tournamentTreeStyle} flex flex-col text-center`,
    },
    createElement(
      "div",
      { class: `text-center items-center` },
      matchRemaining.length !== 0
        ? createElement("div", {}, useLanguage(`next_match`))
        : createElement("div", {}, useLanguage(`final_match`)),
      createElement(
        "div",
        {
          class: `inline-block border-[2px] px-2 bg-[#FFFFFF99] rounded-[8px] justify-center`,
        },
        matchCurrent.join(" - ")
      )
    ),
    matchRemaining.length > 0
      ? createElement(
          "div",
          { class: `` },
          createElement("div", {}, useLanguage(`incoming_matches`)),
          createElement(
            "div",
            { class: `gap-[8px] flex flex-row flex-wrap justify-center` },
            ...(matchRemaining
              ? matchRemaining.map((p) =>
                  createElement(
                    "div",
                    {
                      class: `inline-flex border-[2px] px-2 bg-[#FFFFFF99] rounded-[8px]`,
                    },
                    `${p.join(" - ")}`
                  )
                )
              : [])
          )
        )
      : null
  );
};

const Local = () => {
  const [config, setConfig] = useState<LocalConfig>(null);
  const [tournament, setTournament] = useState<LocalTournament>(null);
  const [sockets, setSockets] = useState<WebSocket[]>([]);
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
      queue: config.mode === "versus" ? [] : [..._.shuffle(config.players)],
      current:
        config.mode === "versus"
          ? [...(config.players as [string, string])]
          : null,
      currentMatchId: `local-${crypto.randomUUID()}`,
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
          currentMatchId: `local-${crypto.randomUUID()}`,
        });
      };

      //todo: find a better way than hard pause to prevent early input
      const delay = setTimeout(
        () => window.addEventListener("keydown", handler, { once: true }),
        3000
      );
      return () => {
        clearTimeout(delay);
        window.removeEventListener("keydown", handler);
      };
    }

    if (tournament.stage === "finished") {
      const handler = () => {
        setConfig(null);
        setTournament(null);
      };

      //todo: find a better way than hard pause to prevent early input
      const delay = setTimeout(
        () => window.addEventListener("keydown", handler, { once: true }),
        3000
      );
      return () => {
        clearTimeout(delay);
        window.removeEventListener("keydown", handler);
      };
    }
  }, [tournament?.stage, tournament?.queue]);

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
        currentMatchId: null,
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
      { class: `${mainBodyStyle}` },

      !config && !tournament
        ? LocalForm({ config: config, setConfig: setConfig })
        : null,

      tournament?.stage === "queue"
        ? GameQueue({ tournament: tournament })
        : null,

      tournament?.stage === "game" && isSocketsReady(sockets)
        ? Game({
            id: `${tournament.currentMatchId}`,
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
            {
              class: `${tournamentTreeStyle} text-center items-center`,
            },
            createElement(
              "div",
              {},
              createElement("div", {}, useLanguage(`winner`)),
              createElement(
                "div",
                { class: `border-[2px] px-2 bg-[#FFFFFF99] rounded-[8px]` },
                `${tournament.queue[0]}`
              )
            )
          )
        : null
    )
  );
};

export default Local;
