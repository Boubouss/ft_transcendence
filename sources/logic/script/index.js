const port = 3000;
const gameId = "100";
const playerId = "0";

const wsUrl = `ws://localhost:${port}/ws/${gameId}/${playerId}`;
const socket = new WebSocket(wsUrl);

const textField = document.getElementById("textField");

socket.addEventListener("message", (event) => {
  textField.innerHTML = event.data;
});

window.addEventListener("keydown", (event) => {
  if (socket.readyState !== WebSocket.OPEN) {
    console.warn("websocket not open");
    return;
  }
  if (event.key === "ArrowUp") {
    socket.send("Up"); //should be replaced by JSON
    console.log("Up");
  } else if (event.key === "ArrowDown") {
    socket.send("Down"); //should be replaced by JSON
    console.log("Down");
  }
});
