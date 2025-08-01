import { createElement } from "#core/render.ts";
import { home_background } from "#pages/Home/style.ts";
// import { fetchAPI } from "#services/data.ts";

//Constants
const PORT = 3001;
const GAME = 0;
const GAME_PARAMS = { gameId: "0", playersId: ["0", "1"], scoreMax: 5 };

const Game = () => {
  return createElement("canvas", {});
};

const Local = () => {
  fetch(`http://localhost:${PORT}/games`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(GAME_PARAMS),
  });

  const sockets = [];
  for (let playerId = 0; playerId < 2; playerId++) {
    const url = `ws://localhost:${PORT}/ws/${GAME}/${playerId}`;
    const socket = new WebSocket(url);
    sockets.push(socket);
  }
  return createElement("div", { class: home_background }, Game());
};

export default Local;
