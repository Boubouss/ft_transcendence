import { useEffect } from "#core/framework.ts";
import { createElement } from "#core/render.ts";
import { scoreStyle, gameContainerStyle } from "../style";
import _ from "lodash";

export type Player = {
  socket: WebSocket;
  control: Map<string, string>;
  input: string[];
};

const ID = "game";

function fetchScores(message: any) {
  const players = message.players as {
    id: string;
    score: number;
    pause: string;
  }[];
  const messageScores = [
    players[message.playerL].score,
    players[message.playerR].score,
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
  id: string;
  scores: number[];
  players: Player[];
  setScores: (toSet: number[]) => void;
}) => {
  useEffect(() => {
    for (const player of props.players) {
      player.socket.onerror = (event) => console.error(event);
      player.socket.onclose = (event) => console.debug(event);
    }
    props.players[0].socket.onmessage = (event) => {
      let message;
      try {
        message = JSON.parse(event.data);
      } catch (e) {
        console.error(e);
        return;
      }
      const actualScores = fetchScores(message);
      if (!_.isEqual(props.scores, actualScores)) {
        props.scores = actualScores; //tocheck: why do I need to reassign the value dispite setScore()
        props.setScores(actualScores);
      }
      render(message);
    };

    window.addEventListener("keydown", (event) => {
      if (!props.players.every((p) => p.socket.readyState === WebSocket.OPEN))
        return;
      if (event.key !== "p" && event.code !== "Space") return;
      for (const player of props.players) {
        player.socket.send(JSON.stringify({ type: "pause", value: "flip" }));
      }
    });

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
  }, [props.id]);

  return createElement("canvas", { id: ID });
};

const Game = (props: {
  id: string;
  scores: number[];
  players: Player[];
  setScores: (toSet: number[]) => void;
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
        players: [props.players[0], props.players[1]],
        setScores: props.setScores,
      })
    )
  );
};

export default Game;
