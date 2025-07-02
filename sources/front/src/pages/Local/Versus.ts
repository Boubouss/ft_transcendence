import {
  type stateMessage,
  LOGIC_WS,
  gameCreate,
  type Player,
} from "./utils.ts";

const player_0: Player = {
  id: "0",
  socket: null,
  input: [],
  control: { up: "w", down: "s" },
};
const player_1: Player = {
  id: "1",
  socket: null,
  input: [],
  control: { up: "w", down: "s" },
};

//todo: replace the type
function renderGame(state: stateMessage) {
  const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;

  if (!gameCanvas) return;

  const ctx = gameCanvas.getContext("2d");
  if (!ctx) return;

  const scoreDiv = document.getElementById(
    "scoreLeft",
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
      paddle.h * ratio,
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

function keydownHandler(event: KeyboardEvent, players: Player[]) {
  console.debug("hello");
  for (let player of players) {
    if (!player.socket) return;
    if (player.socket!.readyState !== WebSocket.OPEN) return;
  }
  for (let player of players) {
    if (event.code !== player.control.up && event.code !== player.control.down)
      continue;
    const value = event.code === player.control.up ? "up" : "down";
    player.socket!.send(JSON.stringify({ type: "input", value: value }));
  }
}

function messageHandler(event: MessageEvent, players: Player[]) {
  let message: stateMessage;
  //todo: validate the message with zod
  try {
    message = JSON.parse(event.data);
    renderGame(message);
  } catch (e) {
    //todo: add some error handling
    return;
  }
  players;
}

function connect(gameId: string, players: Player[]) {
  for (let player of players) {
    player.socket = new WebSocket(`${LOGIC_WS}/ws/${gameId}/${player.id}`);
    //todo: improve the error handling
    player.socket.addEventListener("error", (event) => console.log(event));
    player.socket.addEventListener("close", (event) => console.log(event));
    if (player === players[0])
      player.socket.addEventListener("message", (event) =>
        messageHandler(event, players),
      );
  }
  window.addEventListener("keydown", (event) => keydownHandler(event, players));
  // window.addEventListener("keyup", (event) => (event, players));
}

export function renderVersus() {
  const root = document.getElementById("app-root");
  if (!root) return;
  root.innerHTML = "";

  const app = document.createElement("div");
  app.classList.add(
    "bg-orange-400",
    "flex",
    "h-screen",
    "items-center",
    "justify-center",
    "w-screen",
  );

  const gameContainer = document.createElement("div");
  gameContainer.id = "gameContainer";
  gameContainer.classList.add(
    "bg-white",
    "gap-[2px]",
    "grid",
    "grid-cols-2",
    // "grid-rows-2",
    "grid-rows-[auto_1fr]",
    "items-center",
    "justify-between",
    "p-[2px]",
  );

  const gameCanvas = document.createElement("canvas");
  gameCanvas.id = "gameCanvas";
  gameCanvas.classList.add("col-span-2", "col-1", "row-2");

  const scoreClasses = ["bg-black", "text-white", "text-center", "font-bold"];
  const scoreLeft = document.createElement("div");
  scoreLeft.id = "scoreLeft";
  scoreLeft.style.fontFamily = `font-jaro`;
  scoreLeft.classList.add(...scoreClasses, "col-span-1", "col-1", "row-1");
  const scoreRight = document.createElement("div");
  scoreRight.id = "scoreRight";
  scoreRight.style.fontFamily = `font-jaro`;
  scoreRight.classList.add(...scoreClasses, "col-span-1", "col-2", "row-1");

  root.appendChild(app);
  app.appendChild(gameContainer);
  gameContainer.appendChild(gameCanvas);
  gameContainer.appendChild(scoreLeft);
  gameContainer.appendChild(scoreRight);

  //todo: move the call outside ?
  const gameId = `local-${crypto.randomUUID()}`;
  gameCreate(gameId, [player_0.id, player_1.id], 5).then((response) => {
    console.log(response?.status);
    connect(gameId, [player_0, player_1]);
  });
}
