import { useForm } from "#hooks/useForm.ts";
import { ServerLobbyEvent, type LobbyCreate } from "#types/lobby.ts";

export const requestLobbyCreation = (lobbySocket: WebSocket | null) => {
  if (!lobbySocket) {
    return console.error("Error: socket connection isn't established.");
  }

  const formData = useForm("form_lobby");
  if (!formData) return console.error("Error: form data is empty");

  const data: LobbyCreate = {
    player_limit: parseInt((formData.get("player_limit") ?? 0).toString()),
    is_tournament: false,
  };

  lobbySocket.send(
    JSON.stringify({
      event: ServerLobbyEvent.CREATE,
      data,
    }),
  );
};
