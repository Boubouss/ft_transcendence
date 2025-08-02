import { createElement } from "#core/render.ts";
import { home_background } from "#pages/Home/style.ts";

//Constants
const PORT = 3001;
const GAME = 0;

const Game = ([p1, p2]: [WebSocket, WebSocket?]) => {
  const ID = "game";

  //todo: replace the 'any', find the correct type for the game state
  function render(state: any) {
    const gameCanvas = document.getElementById(ID) as HTMLCanvasElement;
    if (!gameCanvas) return; //todo: wait till the element is loaded
    const ctx = gameCanvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return; //todo: wait till the element is loaded

    const ratio_h = window.innerHeight / state.field.h;
    const ratio_w = window.innerWidth / state.field.w;
    const ratio = Math.min(ratio_w, Math.min(1, ratio_h));
    // console.debug(ratio);

    gameCanvas.height = state.field.h * ratio;
    gameCanvas.width = state.field.w * ratio;
    // console.debug(gameCanvas.height);
    // console.debug(gameCanvas.width);
    gameCanvas.style.background = "black";

    gameCanvas.style.width = `${gameCanvas.width}px`;
    gameCanvas.style.height = `${gameCanvas.height}px`;

    for (const paddle of [state.paddleL, state.paddleR]) {
      ctx.beginPath();
      ctx.rect(
        (paddle.x - paddle.w / 2) * ratio,
        (paddle.y - paddle.h / 2) * ratio,
        paddle.w * ratio,
        paddle.h * ratio,
      );
      ctx.strokeStyle = "white";
      ctx.stroke();
      ctx.fillStyle = "white";
      ctx.fill();
    }

    const ball = state.ball;
    ctx.beginPath();
    ctx.arc(ball.x * ratio, ball.y * ratio, ball.r * ratio, 0, 2 * Math.PI);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.fillStyle = "white";
    ctx.fill();
  }

  p1.addEventListener("error", (event) => console.log(event));
  p1.addEventListener("close", (event) => console.log(event));
  p1.addEventListener("message", (event) => {
    try {
      const message_parsed = JSON.parse(event.data);
      render(message_parsed);
    } catch (e) {
      console.error(e);
    }
  });

  p2?.addEventListener("error", (event) => console.log(event));
  p2?.addEventListener("close", (event) => console.log(event));

  return createElement("canvas", { id: ID, class: `` });
};

const Local = async () => {
  //delete the game
  // fetch(`http://localhost:${PORT}/games`, {
  //   method: "DELETE",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ gameId: "0" }),
  // });

  //create the game
  // try {
  //   fetch(`http://localhost:${PORT}/games`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ gameId: "0", playersId: ["0", "1"], scoreMax: 5 }),
  //   });
  // } catch (error) {}

  //connect the sockets
  const s0 = new WebSocket(`ws://localhost:${PORT}/ws/${GAME}/0`);
  const s1 = new WebSocket(`ws://localhost:${PORT}/ws/${GAME}/1`);

  //create the canvas passing the socket(s)
  return createElement("div", { class: home_background }, Game([s0, s1]));
};

export default Local;
