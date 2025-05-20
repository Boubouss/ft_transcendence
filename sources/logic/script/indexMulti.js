const portInput = document.getElementById("port");
const gameIdInput = document.getElementById("gameId");
const playerIdInput = document.getElementById("playerId");
const textField = document.getElementById("textField");
const confirm = document.getElementById("confirm");

const playerId = playerIdInput.value;

function drawState(state) {
  const gameCanvas = document.getElementById("gameCanvas");
  const ctx = gameCanvas.getContext("2d");

  gameCanvas.height = state.field.h;
  gameCanvas.width = state.field.w;
  gameCanvas.style.background = "black";

  const pairPaddlePlayer = [
    [state.paddleL, state.playerL],
    [state.paddleR, state.playerR],
  ];

  for (const [paddle, player] of pairPaddlePlayer) {
    ctx.beginPath();
    ctx.rect(
      paddle.x - paddle.w / 2,
      paddle.y - paddle.h / 2,
      paddle.w,
      paddle.h,
    );
    if (player == playerIdInput.value) {
      ctx.strokeStyle = "green";
      ctx.fillStyle = "green";
    } else {
      ctx.strokeStyle = "white";
      ctx.fillStyle = "white";
    }
    ctx.fill();
    ctx.stroke();
  }

  const ball = state.ball;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
  ctx.strokeStyle = "white";
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.stroke();
}

function connect() {
  const wsUrl = `ws://localhost:${portInput.value}/ws/${gameIdInput.value}/${playerIdInput.value}`;
  const socket = new WebSocket(wsUrl);

  let pressedKeys = new Set();

  socket.addEventListener("close", (event) => {
    textField.innerHTML = `${event.code}<br>${event.reason}`;
    socket.close();
  });

  socket.addEventListener("message", (event) => {
    try {
      const message_parsed = JSON.parse(event.data);
      drawState(message_parsed);
      textField.innerHTML = `<pre>${JSON.stringify(message_parsed, null, 4)}</pre>`;
    } catch (e) {
      console.error(e);
      textField.innerHTML = `${e}<br>${event.data}`;
      socket.close();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (socket.readyState !== WebSocket.OPEN) return;

    if (!["ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();

    if (event.key === "ArrowUp") {
      pressedKeys.add(event.key);
      socket.send(JSON.stringify({ input: "up" }));
    } else if (event.key === "ArrowDown") {
      pressedKeys.add(event.key);
      socket.send(JSON.stringify({ input: "down" }));
    }
  });

  window.addEventListener("keyup", (event) => {
    if (socket.readyState !== WebSocket.OPEN) return;

    if (!["ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      pressedKeys.delete(event.key);
      if (pressedKeys.has("ArrowUp") && !pressedKeys.has("ArrowDown"))
        socket.send(JSON.stringify({ input: "up" }));
      else if (!pressedKeys.has("ArrowUp") && pressedKeys.has("ArrowDown"))
        socket.send(JSON.stringify({ input: "down" }));
      else if (!pressedKeys.has("ArrowUp") && !pressedKeys.has("ArrowDown"))
        socket.send(JSON.stringify({ input: null }));
    }
  });
}
