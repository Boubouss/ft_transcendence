import { useEffect } from "#core/framework.ts";
import { createElement } from "#core/render.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import type { DrawPadData } from "#types/game.ts";
import { scoreStyle, gameContainerStyle } from "./style";
import _ from "lodash";

export type GamePlayer = {
  id?: number;
  socket: WebSocket;
  control: Map<string, string>;
  input: string[];
};

type MessagePlayer = {
  id: string;
  score: number;
  pause: string;
};

const ID = "game";

function fetchScores(message: any) {
  const players: Map<string, MessagePlayer> = new Map(message.players);
  const messageScores = [
    players.get(message.playerL)?.score ?? -1,
    players.get(message.playerR)?.score ?? -1,
  ];

  //todo: might need to add some check to verify that messageScores is valid
  return messageScores;
}

function drawPad({ ctx, pad, ratio }: DrawPadData, isCurrentPlayer: boolean) {
  const color = isCurrentPlayer ? "#00FF78" : "white";
  const rect = [pad.x - pad.w / 2, pad.y - pad.h / 2, pad.w, pad.h];
  const [x, y, w, h] = rect.map((d) => d * ratio);
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, Math.min(w, h) / 4);
  ctx.fillStyle = color;
  ctx.fill();
}

//todo: replace the 'any', find the correct type for the game state
function render(state: any, player: GamePlayer) {
  const gameCanvas = document.getElementById(ID) as HTMLCanvasElement;
  if (!gameCanvas) return;

  const ctx = gameCanvas.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) return;

  const ratio_h = window.innerHeight / state.field.h;
  const ratio_w = window.innerWidth / state.field.w;
  const ratio = Math.min(ratio_w, Math.min(1, ratio_h));

  gameCanvas.height = state.field.h * ratio;
  gameCanvas.width = state.field.w * ratio;
  gameCanvas.style.background = "black";

  drawPad(
    { ctx, pad: state.paddleL, ratio },
    state.playerL === player.id?.toString()
  );

  drawPad(
    { ctx, pad: state.paddleR, ratio },
    state.playerR === player.id?.toString()
  );

  const ball = state.ball;
  const [x, y, r] = [ball.x, ball.y, ball.r].map((d) => d * ratio);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = "white";
  ctx.fill();

  if (state.state === "paused" || state.sleep) {
    const sleep =
      Math.floor((state.sleep * 4) / 60) <= 1
        ? useLanguage(`start`)
        : useLanguage(`ready`);
    const text = state.state === "paused" ? `PAUSE` : sleep;

    ctx.font = `${64 * ratio}px jaro`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    ctx.strokeText(text, gameCanvas.width / 2, gameCanvas.height / 2);
    ctx.fillStyle = "black";
    ctx.fillText(text, gameCanvas.width / 2, gameCanvas.height / 2);
  }
}

const GameField = (props: {
  id: string;
  scores: number[];
  players: GamePlayer[];
  setScores: (toSet: number[]) => void;
  isRemote?: boolean;
}) => {
  useEffect(() => {
    for (const player of props.players) {
      player.socket.onerror = (event) => console.error(event);
      player.socket.onclose = (event) => console.debug(event);
    }

    const handlePause = (event: KeyboardEvent) => {
      if (!props.players.every((p) => p.socket.readyState === WebSocket.OPEN))
        return;
      if (event.key !== "p" && event.code !== "Space") return;
      props.players.forEach((p) =>
        p.socket.send(JSON.stringify({ type: "pause", value: "flip" }))
      );
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!props.players.every((p) => p.socket.readyState === WebSocket.OPEN))
        return;
      for (const player of props.players) {
        if (!player.control.has(event.key)) continue;
        event.preventDefault();
        player.input.push(event.key);
        const move = player.control.get(event.key);
        player.socket.send(JSON.stringify({ type: "input", value: move }));
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!props.players.every((p) => p.socket.readyState === WebSocket.OPEN))
        return;
      for (const player of props.players) {
        if (!player.control.has(event.key)) continue;
        event.preventDefault();
        player.input = player.input.filter((k) => k !== event.key);
        const move = player.control.get(player.input.at(-1) || "");
        player.socket.send(
          JSON.stringify({ type: "input", value: move || null })
        );
      }
    };

    if (!props.isRemote) window.addEventListener("keydown", handlePause);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      if (!props.isRemote) window.removeEventListener("keydown", handlePause);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [props.players]);

  useEffect(() => {
    const player = _.first(props.players);
    if (_.isEmpty(player)) return;

    player.socket.onmessage = (event) => handleLogicMessage(event, player);
  }, [props.id, props.players, props.scores]);

  const handleLogicMessage = (event: MessageEvent, player: GamePlayer) => {
    try {
      const message = JSON.parse(event.data);
      const actualScores = fetchScores(message);

      if (!_.isEqual(props.scores, actualScores)) {
        props.setScores(actualScores);
      }

      render(message, player);
    } catch (e) {
      console.error(e);
    }
  };

  return createElement("canvas", { id: ID });
};

const Game = (props: {
  id: string;
  scores: number[];
  setScores: (toSet: number[]) => void;
  players: GamePlayer[];
  isRemote?: boolean;
}) => {
  return createElement(
    "div",
    { class: gameContainerStyle },
    createElement(
      "div",
      { class: scoreStyle + ` col-1 row-1` },
      `${props.scores[0]}`
    ),
    createElement(
      "div",
      { class: scoreStyle + ` col-2 row-1` },
      `${props.scores[1]}`
    ),
    createElement(
      "div",
      { class: "col-1 col-span-2" },
      GameField({
        id: props.id,
        scores: props.scores,
        setScores: props.setScores,
        players: props.players,
        isRemote: props.isRemote,
      })
    )
  );
};

export default Game;
