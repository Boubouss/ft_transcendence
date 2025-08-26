import { useEffect, useState, type ComponentAttr } from "#core/framework.ts";
import { createElement } from "#core/render.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import { scoreStyle, gameContainerStyle } from "./style";
import _ from "lodash";

export type GamePlayer = {
  id?: number;
  socket: WebSocket;
  control: Map<string, string>;
  input: string[];
};

type MessagePlayer = {
  id: string;
  score: number;
  pause: string;
};

const ID = "game";
const asset_background = new Image();
asset_background.src = "/asset/background.webp";
const asset_paddle = new Image();
asset_paddle.src = "/asset/paddle.png";
const asset_ball = new Image();
asset_ball.src = "/asset/ball.png";
let rotation = 0;

function fetchScores(message: any) {
  const players: Map<string, MessagePlayer> = new Map(message.players);
  const messageScores = [
    players.get(message.playerL)?.score ?? -1,
    players.get(message.playerR)?.score ?? -1,
  ];

  //todo: might need to add some check to verify that messageScores is valid
  return messageScores;
}

//todo: replace the 'any', find the correct type for the game state
function render(state: any) {
  const gameCanvas = document.getElementById(ID) as HTMLCanvasElement;
  if (!gameCanvas) return;

  const ctx = gameCanvas.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) return;

  const ratio_h = window.innerHeight / state.field.h;
  const ratio_w = window.innerWidth / state.field.w;
  const ratio = Math.min(ratio_w, Math.min(1, ratio_h));

  gameCanvas.height = state.field.h * ratio;
  gameCanvas.width = state.field.w * ratio;
  ctx.drawImage(asset_background, 0, 0, gameCanvas.width, gameCanvas.height);

  for (const pad of [state.paddleL, state.paddleR]) {
    const rect = [pad.x - pad.w / 2, pad.y - pad.h / 2, pad.w, pad.h];
    const [x, y, w, h] = rect.map((d) => d * ratio);
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 5);
    ctx.clip();
    ctx.drawImage(asset_paddle, x, y, w, h);
    ctx.restore();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 5);
    ctx.stroke();
  }

  const ball = state.ball;
  const [x, y, r] = [ball.x, ball.y, ball.r].map((d) => d * ratio);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.drawImage(asset_ball, -r, -r, r * 2, r * 2);
  ctx.restore();
  if (state.state !== "paused" && !state.sleep)
    rotation += 0.1 * (state.ball.dx > 0 ? 1 : -1);

  if (state.state === "paused" || state.sleep) {
    const isStarting = Math.floor((state.sleep * 4) / 60) <= 1;
    const sleep = isStarting ? useLanguage(`start`) : useLanguage(`ready`);
    const text = state.state === "paused" ? `PAUSE` : sleep;

    ctx.font = `${64 * ratio}px jaro`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    ctx.strokeText(text, gameCanvas.width / 2, gameCanvas.height / 2);
    ctx.fillStyle = "black";
    ctx.fillText(text, gameCanvas.width / 2, gameCanvas.height / 2);
  }
}

const GameField = (props: {
  id: string;
  scores: number[];
  players: GamePlayer[];
  setScores: (toSet: number[]) => void;
  isRemote?: boolean;
  activePlayersState: [string[], (value: string[]) => void];
}) => {
  const [activePlayers, setActivePlayers] = props.activePlayersState;

  useEffect(() => {
    const handlePause = (event: KeyboardEvent) => {
      if (!props.players.every((p) => p.socket.readyState === WebSocket.OPEN))
        return;
      if (event.key !== "p" && event.code !== "Space") return;
      props.players.forEach((p) =>
        p.socket.send(JSON.stringify({ type: "pause", value: "flip" }))
      );
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!props.players.every((p) => p.socket.readyState === WebSocket.OPEN))
        return;
      for (const player of props.players) {
        if (!player.control.has(event.key)) continue;
        event.preventDefault();
        player.input.push(event.key);
        const move = player.control.get(event.key);
        player.socket.send(JSON.stringify({ type: "input", value: move }));
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!props.players.every((p) => p.socket.readyState === WebSocket.OPEN))
        return;
      for (const player of props.players) {
        if (!player.control.has(event.key)) continue;
        event.preventDefault();
        player.input = player.input.filter((k) => k !== event.key);
        const move = player.control.get(player.input.at(-1) || "");
        player.socket.send(
          JSON.stringify({ type: "input", value: move || null })
        );
      }
    };

    if (!props.isRemote) window.addEventListener("keydown", handlePause);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      if (!props.isRemote) window.removeEventListener("keydown", handlePause);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [props.players]);

  useEffect(() => {
    const player = _.first(props.players);
    if (_.isEmpty(player)) return;

    player.socket.onmessage = (event) => handleLogicMessage(event);
  }, [props.id, props.players, props.scores]);

  const handleLogicMessage = (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      const actualScores = fetchScores(message);
      const playerIds = [message.playerL, message.playerR];

      if (!_.isEqual(activePlayers, playerIds)) setActivePlayers(playerIds);
      if (!_.isEqual(props.scores, actualScores)) props.setScores(actualScores);

      render(message);
    } catch (e) {
      console.error(e);
    }
  };

  return createElement("canvas", { id: ID });
};

const Game = (props: {
  id: string;
  scores: number[];
  setScores: (toSet: number[]) => void;
  players: GamePlayer[];
  isRemote: boolean;
  attr?: ComponentAttr;
}) => {
  const [activePlayers, setActivePlayers] = useState<string[]>([]);

  if (props.attr?.class === "hidden") {
    console.log("early return");
    return null;
  }
  const getScoreElement = (score: number, player: GamePlayer, side: 0 | 1) => {
    let _class = scoreStyle + (side === 0 ? " col-1" : " col-2");
    if (!props.isRemote)
      return createElement("div", { class: _class }, `${score}`);
    const isCurrent = player.id?.toString() === activePlayers[side];
    _class += isCurrent ? " text-white" : " text-black";
    return createElement("div", { class: _class }, `> ${score} <`);
  };

  const default_attr = { class: gameContainerStyle };
  let { attr } = props;
  attr = { ...default_attr, ...(attr || {}) };
  return createElement(
    "div",
    attr,
    getScoreElement(props.scores[0], _.first(props.players)!, 0),
    getScoreElement(props.scores[1], _.first(props.players)!, 1),
    createElement(
      "div",
      { class: "col-1 col-span-2" },
      GameField({
        id: props.id,
        scores: props.scores,
        setScores: props.setScores,
        players: props.players,
        isRemote: props.isRemote,
        activePlayersState: [activePlayers, setActivePlayers],
      })
    )
  );
};

export default Game;
