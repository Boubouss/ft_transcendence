import { useEffect } from "#core/framework.ts";
import { createElement } from "#core/render.ts";
import _ from "lodash";
import { scoreStyle, gameContainerStyle } from "./style";

export type GamePlayer = {
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

//todo: replace the 'any', find the correct type for the game state
function render(state: any) {
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

  for (const pad of [state.paddleL, state.paddleR]) {
    const rect = [pad.x - pad.w / 2, pad.y - pad.h / 2, pad.w, pad.h];
    const [x, y, w, h] = rect.map((d) => d * ratio);
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.fillStyle = "white";
    ctx.fill();
  }

  const ball = state.ball;
  const [x, y, r] = [ball.x, ball.y, ball.r].map((d) => d * ratio);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.strokeStyle = "white";
  ctx.stroke();
  ctx.fillStyle = "white";
  ctx.fill();
}

//todo: add some error handling (no player, ...)
const GameField = (props: {
  scores: number[];
  setScores: (toSet: number[]) => void;
  players: GamePlayer[];
}) => {
  useEffect(() => {
    for (const player of props.players) {
      player.socket.addEventListener("error", (event) => console.error(event));
      player.socket.addEventListener("close", (event) => console.debug(event));
    }

    window.addEventListener("keydown", (event) => {
      if (!props.players.every((p) => p.socket.readyState === WebSocket.OPEN))
        return;
      for (const player of props.players) {
        if (![...player.control.keys()].includes(event.key)) continue;
        event.preventDefault();
        player.input.push(event.key);
        const move = player.control.get(event.key) || null;
        const data = JSON.stringify({ type: "input", value: move || null });
        player.socket.send(data);
      }
    });

    window.addEventListener("keyup", (event) => {
      if (!props.players.every((p) => p.socket.readyState === WebSocket.OPEN))
        return;
      for (const player of props.players) {
        if (![...player.control.keys()].includes(event.key)) continue;
        event.preventDefault();
        player.input = player.input.filter((input) => input !== event.key);
        const move = player.control.get(player.input[player.input.length - 1]);
        const data = JSON.stringify({ type: "input", value: move || null });
        player.socket.send(data);
      }
    });
  }, [props.players]);

  useEffect(() => {
    const player = _.first(props.players);
    if (_.isEmpty(player)) return;

    player.socket.onmessage = (event) => handleLogicMessage(event);
  }, [props.players, props.scores]);

  const handleLogicMessage = (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      const actualScores = fetchScores(message);

      if (!_.isEqual(props.scores, actualScores)) {
        props.setScores(actualScores);
      }

      render(message);
    } catch (e) {
      console.error(e);
    }
  };

  return createElement("canvas", { id: ID });
};

const Game = (props: {
  scores: number[];
  setScores: (toSet: number[]) => void;
  players: GamePlayer[];
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
        scores: props.scores,
        setScores: props.setScores,
        players: props.players,
      })
    )
  );
};

export default Game;
