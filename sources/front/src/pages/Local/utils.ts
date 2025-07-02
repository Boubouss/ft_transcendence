import axios from "axios";

//todo: replace the hardcoded value
export const LOGIC_HTTP = `http://localhost:3001`;
export const LOGIC_WS = `ws://localhost:3001`;

export type stateMessage = {
  gameId: string;
  state: string;
  players: { playerId: string; score: number; input: null | "up" | "down" }[];
  queue: string[];
  field: { h: number; w: number };
  playerL: string;
  playerR: string;
  paddleL: { x: number; y: number; h: number; w: number };
  paddleR: { x: number; y: number; h: number; w: number };
  ball: { x: number; y: number; r: number; dx: number; dy: number };
};

export interface Player {
  id: string;
  socket: WebSocket | null;
  input: string[];
  control: {
    up: "w" | "ArrowUp";
    down: "s" | "ArrowDown";
  };
}

export async function gameCreate(id: string, players: string[], score: number) {
  const url = `${LOGIC_HTTP}/create_game`;
  const body = { gameId: id, playersId: players, scoreMax: score };
  try {
    const response = await axios.post(url, body, {
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    //todo: add some error handling
  }
}

export async function gameDelete(id: string) {
  const url = `${LOGIC_HTTP}/delete_game`;
  try {
    const response = await axios.post(url, {
      headers: { "Content-Type": "application/json" },
      data: { gameId: id },
    });
    return response;
  } catch (error) {
    //todo: add some the error handling
  }
}
