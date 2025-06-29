const portInput = document.getElementById("port");
const gameIdInput = document.getElementById("gameId");
const textField = document.getElementById("textField");
const confirm = document.getElementById("confirm");
const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

const assetTiles = [
  "./Sliced/PNG0000.PNG",
  "./Sliced/PNG0001.PNG",
  "./Sliced/PNG0002.PNG",
  "./Sliced/PNG0003.PNG",
];
const assetDecos = [
  "./Sliced/PNG0004.PNG",
  "./Sliced/PNG0005.PNG",
  "./Sliced/PNG0006.PNG",
  "./Sliced/PNG0007.PNG",
  "./Sliced/PNG0008.PNG",
  "./Sliced/PNG0009.PNG",
  "./Sliced/PNG0010.PNG",
  "./Sliced/PNG0011.PNG",
];

const paddleImg = new Image();
paddleImg.src = "./Crate sprite sheet.png";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateMapTiles() {
  const map = [];
  //todo: replace the 19 and 25
  for (let y = 0; y < 19; y++) {
    const row = [];
    for (let x = 0; x < 25; x++) {
      const tileImg = new Image();
      tileImg.src = assetTiles[getRandomInt(0, assetTiles.length)];

      let decoImg = null;
      if (Math.random() < 0.2) {
        decoImg = new Image();
        decoImg.src = assetDecos[getRandomInt(0, assetDecos.length)];
      }
      row.push([tileImg, decoImg]);
    }
    map.push(row);
  }
  return map;
}
const backgroundTiles = generateMapTiles();

function drawState(state) {
  const ratio_h = window.innerHeight / state.field.h;
  const ratio_w = window.innerWidth / state.field.w;
  const ratio = Math.min(1, ratio_h, ratio_w);

  gameCanvas.height = state.field.h * ratio;
  gameCanvas.width = state.field.w * ratio;

  // draw the background
  backgroundTiles.forEach((row, n_row) => {
    row.forEach((cell, n_cell) => {
      const tile = cell[0];
      const tile_w = tile.width;
      const tile_h = tile.height;
      ctx.drawImage(tile, n_cell * tile_w, n_row * tile_h, tile_w, tile_h);
      if (!cell[1]) return;
      ctx.drawImage(cell[1], n_cell * tile_w, n_row * tile_h, tile_w, tile_h);
    });
  });

  const size = 24;
  ctx.textAlign = "center";
  ctx.fillStyle = "blue";
  ctx.font = `${Math.floor(size * ratio)}px arial`;
  const speed = Math.sqrt(state.ball.dx ** 2 + state.ball.dy ** 2);
  console.log(speed);
  ctx.fillText(speed.toFixed(2), gameCanvas.width / 2, size * ratio);

  for (const pad of [state.paddleL, state.paddleR]) {
    const rect = [pad.x - pad.w / 2, pad.y - pad.h / 2, pad.w, pad.h];
    ctx.drawImage(paddleImg, 0, 0, 64, 64, ...rect);
  }

  const ball = state.ball;
  // const arc = [ball.x, ball.y, ball.r];
  //todo: replace with a circle
  const rect = [ball.x - ball.r, ball.y - ball.r, ball.r * 2, ball.r * 2];

  ctx.drawImage(paddleImg, 0, 0, 64, 64, ...rect);
  // ctx.beginPath();
  // ctx.arc(...arc.map((value) => value * ratio), 0, 2 * Math.PI);
  // ctx.strokeStyle = "blue";
  // ctx.stroke();
  // ctx.fillStyle = "blue";
  // ctx.fill();
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
  ]);
  let control_1 = new Map([
    ["ArrowUp", "up"],
    ["ArrowDown", "down"],
  ]);

  window.addEventListener("keydown", (event) => {
    if (socket_0.readyState !== WebSocket.OPEN) return;
    if (socket_1.readyState !== WebSocket.OPEN) return;
    if (event.key !== "p" && event.code !== "Space") return;
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
