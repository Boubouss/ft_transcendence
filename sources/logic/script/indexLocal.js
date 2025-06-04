const portInput = document.getElementById("port");
const gameIdInput = document.getElementById("gameId");
const textField = document.getElementById("textField");
const confirm = document.getElementById("confirm");

function drawState(state) {
  const gameCanvas = document.getElementById("gameCanvas");
  const ctx = gameCanvas.getContext("2d");

  gameCanvas.height = state.field.h;
  gameCanvas.width = state.field.w;
  gameCanvas.style.background = "black";

  for (paddle of [state.paddleL, state.paddleR]) {
    ctx.beginPath();
    ctx.rect(
      paddle.x - paddle.w / 2,
      paddle.y - paddle.h / 2,
      paddle.w,
      paddle.h,
    );
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.stroke();
  }

  const ball = state.ball;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.stroke();
}

function connect() {
  const socket_0 = new WebSocket(
    `ws://localhost:${portInput.value}/ws/${gameIdInput.value}/0`,
  );
  const socket_1 = new WebSocket(
    `ws://localhost:${portInput.value}/ws/${gameIdInput.value}/1`,
  );

  socket_0.addEventListener("close", (event) => {
    textField.innerHTML = `${event.code}<br>${event.reason}`;
    socket_0.close();
  });

  socket_0.addEventListener("message", (event) => {
    try {
      const message_parsed = JSON.parse(event.data);
      drawState(message_parsed);
      textField.innerHTML = `<pre>${JSON.stringify(message_parsed, null, 4)}</pre>`;
    } catch (e) {
      console.log(e);
      textField.innerHTML = `${e}<br>${event.data}`;
      socket_0.close();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (socket_0.readyState !== WebSocket.OPEN) return;
    if (socket_1.readyState !== WebSocket.OPEN) return;

    if (!["ArrowUp", "ArrowDown", "w", "s"].includes(event.key)) return;
    event.preventDefault();

    if (event.key === "ArrowUp") {
      socket_0.send(JSON.stringify({ input: "up" }));
    }
    if (event.key === "ArrowDown") {
      socket_0.send(JSON.stringify({ input: "down" }));
    }
    if (event.key === "w") {
      socket_1.send(JSON.stringify({ input: "up" }));
    }
    if (event.key === "s") {
      socket_1.send(JSON.stringify({ input: "down" }));
    }
  });
  window.addEventListener("keyup", (event) => {
    if (socket_0.readyState !== WebSocket.OPEN) return;
    if (socket_1.readyState !== WebSocket.OPEN) return;

    if (!["ArrowUp", "ArrowDown", "w", "s"].includes(event.key)) return;
    event.preventDefault();

    if (event.key === "ArrowUp") {
      socket_0.send(JSON.stringify({ input: null }));
    }
    if (event.key === "ArrowDown") {
      socket_0.send(JSON.stringify({ input: null }));
    }
    if (event.key === "w") {
      socket_1.send(JSON.stringify({ input: null }));
    }
    if (event.key === "s") {
      socket_1.send(JSON.stringify({ input: null }));
    }
  });
}
