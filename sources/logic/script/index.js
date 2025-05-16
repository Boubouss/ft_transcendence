const portInput = document.getElementById("port");
const gameIdInput = document.getElementById("gameId");
const playerIdInput = document.getElementById("playerId");
const textField = document.getElementById("textField");
const confirm = document.getElementById("confirm");

function connect() {
  const wsUrl = `ws://localhost:${portInput.value}/ws/${gameIdInput.value}/${playerIdInput.value}`;
  const socket = new WebSocket(wsUrl);

  socket.addEventListener("message", (event) => {
    textField.innerHTML = event.data;
  });

  window.addEventListener("keydown", (event) => {
    if (socket.readyState !== WebSocket.OPEN) return;
    if (event.key === "ArrowUp") {
      socket.send(JSON.stringify({ input: "up" }));
    } else if (event.key === "ArrowDown") {
      socket.send(JSON.stringify({ input: "down" }));
    }
  });
}
