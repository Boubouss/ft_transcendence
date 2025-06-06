// wsClient.ts
let socket: WebSocket | null = null;

export function openSocketMulti() {
  if (socket) return; // déjà ouvert

  socket = new WebSocket("wss://ton-backend/ws");

  socket.onopen = () => console.log("WebSocket ouvert");
  socket.onmessage = (ev) => console.log("Reçu :", ev.data);
  socket.onclose = () => console.log("WebSocket fermé");
  socket.onerror = (err) => console.error("Erreur WebSocket", err);
}

export function closeSocketMulti() {
  if (!socket) return;
  socket.close();
  socket = null;
}

export function sendSocketMessage(data: any) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
}



