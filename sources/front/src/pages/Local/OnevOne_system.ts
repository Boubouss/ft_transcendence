import type { toJson_T } from "@pages/Local/type.ts";
import { create_game, delete_game } from "./utils";
import { openSocketMulti } from "../Multiplayer/MultiWSS";

function drawState(state: toJson_T) {
  const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;

  if (!gameCanvas) return;

  const ctx = gameCanvas.getContext("2d");
  if (!ctx) return;

  const scoreDiv = document.getElementById(
    "score_p_1"
  ) as HTMLDivElement | null;
  const scoreHeight = scoreDiv?.clientHeight || 30;

  //todo: remove the hardcoded 4 and 6 that compensate the 2px gaps
  const ratio_h = (window.innerHeight - scoreHeight - 2) / state.field.h;
  const ratio_w = (window.innerWidth - 4) / state.field.w;
  const ratio = Math.min(ratio_w, ratio_h);

  gameCanvas.height = state.field.h * ratio;
  gameCanvas.width = state.field.w * ratio;
  gameCanvas.style.background = "black";

  for (const paddle of [state.paddleL, state.paddleR]) {
    ctx.beginPath();
    ctx.rect(
      (paddle.x - paddle.w / 2) * ratio,
      (paddle.y - paddle.h / 2) * ratio,
      paddle.w * ratio,
      paddle.h * ratio
    );
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.stroke();
  }

  const ball = state.ball;
  ctx.beginPath();
  ctx.arc(ball.x * ratio, ball.y * ratio, ball.r * ratio, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.stroke();
}

export async function connect() {
  await create_game();

  const socket_0 = new WebSocket(`ws://localhost:${3001}/ws/${-1}/0`);
  const socket_1 = new WebSocket(`ws://localhost:${3001}/ws/${-1}/1`);

  // no need to listen to both sockets
  socket_0.addEventListener("error", (event) => console.log(event));
  socket_0.addEventListener("close", (event) => console.log(event));
  socket_1.addEventListener("error", (event) => console.log(event));
  socket_1.addEventListener("close", (event) => console.log(event));
  socket_1.addEventListener("message", (event) => {
    let message: toJson_T;

    try {
      message = JSON.parse(event.data);
      drawState(message);
    } catch (e) {
      console.error(e);
      socket_0.close();
      return;
    }

    console.log(message);
    for (const [playerId, scoreId] of [
      [message.playerL, "scoreLeft"],
      [message.playerR, "scoreRight"],
    ]) {
      const scoreElement = document.getElementById(scoreId);
      const playerInfo = message.players.find(
        (playerInfo) => playerInfo.playerId === playerId
      );
      if (!scoreElement || !playerInfo) continue;
      scoreElement.textContent = `${playerInfo.score}`;
    }
  });

  let input_0: string[] = [];
  let input_1: string[] = [];
  let control_0 = new Map([
    ["w", "up"],
    ["s", "down"],
  ]);
  let control_1 = new Map([
    ["ArrowUp", "up"],
    ["ArrowDown", "down"],
  ]);

  window.addEventListener("keydown", (event) => {
    if (socket_0.readyState !== WebSocket.OPEN) return;
    if (socket_1.readyState !== WebSocket.OPEN) return;

    if (![...control_0.keys(), ...control_1.keys()].includes(event.key)) return;
    event.preventDefault();

    if (control_0.has(event.key)) {
      input_0.push(event.key);
      const direction = control_0.get(event.key) || null;
      socket_0.send(JSON.stringify({ input: direction }));
    }

    if (control_1.has(event.key)) {
      input_1.push(event.key);
      const direction = control_1.get(event.key) || null;
      socket_1.send(JSON.stringify({ input: direction }));
    }
  });
  window.addEventListener("keyup", (event) => {
    if (socket_0.readyState !== WebSocket.OPEN) return;
    if (socket_1.readyState !== WebSocket.OPEN) return;

    if (![...control_0.keys(), ...control_1.keys()].includes(event.key)) return;
    event.preventDefault();

    if (control_0.has(event.key)) {
      input_0 = input_0.filter((input) => input !== event.key);
      const direction = control_0.get(input_0[input_0.length - 1]) || null;
      socket_0.send(JSON.stringify({ input: direction }));
    }

    if (control_1.has(event.key)) {
      input_1 = input_1.filter((input) => input !== event.key);
      const direction = control_1.get(input_1[input_1.length - 1]) || null;
      socket_1.send(JSON.stringify({ input: direction }));
    }
  });

  // 👂 Écoute de tous les changements d'URL
  window.addEventListener("locationchange", () => {
    console.log(
      "🔄 URL changée :",
      window.location.pathname + window.location.hash

    );
    socket_0.close();
    socket_1.close();
    delete_game("-1")
  }, {once:true});
}
