import type { LobbySocketHandlersRecord, StatesRecord } from "./lobby.ts";
import type { ClientLobbyEvent } from "#types/lobby.ts";

type SocketMessage = {
  event: ClientLobbyEvent;
  data: any;
};

export function handleSocket(
  e: MessageEvent,
  handlers: LobbySocketHandlersRecord,
  states: StatesRecord,
) {
  const { event, data }: SocketMessage = JSON.parse(e.data);

  if (!handlers[event]) errorSocket();
  else handlers[event](data, states);
}

function errorSocket() {
  console.error("No handler in the object");
}
