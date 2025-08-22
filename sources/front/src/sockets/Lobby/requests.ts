import { useForm } from "#hooks/useForm.ts";
import _ from "lodash";

import {
  Action,
  LobbyServerEvent,
  type LobbyCreate,
  type LobbyPlayerAction,
} from "#types/lobby.ts";

export const requestLobbyCreation = (lobbySocket: WebSocket | null) => {
  if (!lobbySocket) {
    return console.error("Error: socket connection isn't established.");
  }

  const formData = useForm("form_lobby");
  if (!formData) return console.error("Error: form data is empty");

  const data: LobbyCreate = {
    name: (formData.get("name") ?? "").toString(),
    player_limit: parseInt((formData.get("player_limit") ?? 2).toString()),
    score_max: parseInt((formData.get("score_max") ?? 5).toString()),
    is_tournament:
      (formData.get("is_tournament") ?? false).toString().toLowerCase() ===
      "true",
  };

  lobbySocket.send(
    JSON.stringify({
      event: LobbyServerEvent.CREATE,
      data,
    })
  );
};

export const requestAction = (
  lobbySocket: WebSocket | null,
  action: Action,
  target_id: number,
  player_id?: number
) => {
  if (!lobbySocket) {
    return console.error("Error: socket connection isn't established.");
  }

  const data: LobbyPlayerAction = {
    action,
    target_id,
    player_id,
  };

  lobbySocket.send(
    JSON.stringify({
      event: LobbyServerEvent.ACTION,
      data,
    })
  );
};
