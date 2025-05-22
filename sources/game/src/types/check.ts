import { LobbyCreate, PlayerAction } from "./types";
import _ from "lodash";

export const isLobbyCreate = (data: LobbyCreate) => {
  return !_.isEmpty(data) && typeof data.player_limit === "number";
}

export const isPlayerAction = (data: PlayerAction) => {
  return !_.isEmpty(data) && typeof data.target_id === "number" && typeof data.action === "string";
}
