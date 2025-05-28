const portInput = document.getElementById("port");
const gameIdInput = document.getElementById("gameId");
const playerIdInput = document.getElementById("playerId");
const textField = document.getElementById("textField");
const confirm = document.getElementById("confirm");

function connect() {
  const wsUrl = `ws://localhost:${portInput.value}/ws/${gameIdInput.value}/${playerIdInput.value}`;
  const socket = new WebSocket(wsUrl);

  socket.addEventListener("message", (event) => {
    try {
      const message_parsed = JSON.parse(event.data);
      textField.innerHTML = `<pre>${JSON.stringify(message_parsed, null, 4)}</pre>`;
    } catch (e) {
      console.log(e);
      textField.innerHTML = `${e}<br>${event.data}`;
      socket.close();
    }
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
