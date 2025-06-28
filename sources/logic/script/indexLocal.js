const portInput = document.getElementById("port");
const gameIdInput = document.getElementById("gameId");
const textField = document.getElementById("textField");
const confirm = document.getElementById("confirm");

const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

function drawState(state) {
  const ratio_h = window.innerHeight / state.field.h;
  const ratio_w = window.innerWidth / state.field.w;
  const ratio = Math.min(1, ratio_h, ratio_w);

  gameCanvas.height = state.field.h * ratio;
  gameCanvas.width = state.field.w * ratio;
  gameCanvas.style.background = "black";

  const size = 24;
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.font = `${Math.floor(size * ratio)}px bold arial`;
  const speed = Math.sqrt(state.ball.dx ** 2 + state.ball.dy ** 2);
  console.log(speed);
  ctx.fillText(speed.toFixed(2), gameCanvas.width / 2, size * ratio);

  for (const pad of [state.paddleL, state.paddleR]) {
    ctx.beginPath();
    const rect = [pad.x - pad.w / 2, pad.y - pad.h / 2, pad.w, pad.h];
    ctx.rect(...rect.map((value) => value * ratio));
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.fillStyle = "white";
    ctx.fill();
  }

  const ball = state.ball;
  ctx.beginPath();
  const arc = [ball.x, ball.y, ball.r];
  ctx.arc(...arc.map((value) => value * ratio), 0, 2 * Math.PI);
  ctx.strokeStyle = "white";
  ctx.stroke();
  ctx.fillStyle = "white";
  ctx.fill();
}

function connect() {
  const socket_0 = new WebSocket(
    `ws://localhost:${portInput.value}/ws/${gameIdInput.value}/0`,
  );
  const socket_1 = new WebSocket(
    `ws://localhost:${portInput.value}/ws/${gameIdInput.value}/1`,
  );

  // no need to listen to both sockets
  socket_0.addEventListener("error", (event) => console.log(event));
  socket_0.addEventListener("close", (event) => console.log(event));
  socket_1.addEventListener("error", (event) => console.log(event));
  socket_1.addEventListener("close", (event) => console.log(event));
  socket_1.addEventListener("message", (event) => {
    try {
      const message_parsed = JSON.parse(event.data);
      drawState(message_parsed);
      textField.innerHTML = `<pre>${JSON.stringify(message_parsed, null, 4)}</pre>`;
    } catch (e) {
      console.error(e);
      textField.innerHTML = `${e}<br>${event.data}`;
      socket_0.close();
    }
  });

  let input_0 = [];
  let input_1 = [];
  let control_0 = new Map([
    ["w", "up"],
    ["s", "down"],
    ["e", "test"],
  ]);
  let control_1 = new Map([
    ["ArrowUp", "up"],
    ["ArrowDown", "down"],
  ]);

  window.addEventListener("keydown", (event) => {
    if (socket_0.readyState !== WebSocket.OPEN) return;
    if (socket_1.readyState !== WebSocket.OPEN) return;
    if (event.key !== "p") return;
    socket_0.send(JSON.stringify({ type: "pause", value: "flip" }));
  });

  window.addEventListener("keydown", (event) => {
    if (socket_0.readyState !== WebSocket.OPEN) return;
    if (socket_1.readyState !== WebSocket.OPEN) return;

    if (![...control_0.keys(), ...control_1.keys()].includes(event.key)) return;
    event.preventDefault();

    if (control_0.has(event.key)) {
      input_0.push(event.key);
      const direction = control_0.get(event.key) || null;
      socket_0.send(JSON.stringify({ type: "input", value: direction }));
    }

    if (control_1.has(event.key)) {
      input_1.push(event.key);
      const direction = control_1.get(event.key) || null;
      socket_1.send(JSON.stringify({ type: "input", value: direction }));
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
      socket_0.send(JSON.stringify({ type: "input", value: direction }));
    }

    if (control_1.has(event.key)) {
      input_1 = input_1.filter((input) => input !== event.key);
      const direction = control_1.get(input_1[input_1.length - 1]) || null;
      socket_1.send(JSON.stringify({ type: "input", value: direction }));
    }
  });
}
