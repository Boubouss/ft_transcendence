import type { LobbiesState } from "#pages/Multiplayer/Multiplayer.ts";
import { ClientLobbyEvent, SocketLobbyState } from "#types/lobby.ts";
import type { Lobby } from "#types/lobby.ts";
import _ from "lodash";

export type StatesRecord = Record<SocketLobbyState, LobbiesState>;

export type LobbySocketHandlersRecord = Record<
  ClientLobbyEvent,
  (data: Lobby[] | any, states: StatesRecord) => void
>;

const initLobbyList = (data: Lobby[], states: StatesRecord) => {
  const [_, setLobbies] = states[SocketLobbyState.LOBBIES_STATE];

  setLobbies(data);
};

const createLobby = (newLobby: Lobby, states: StatesRecord) => {
  const [lobbies, setLobbies] = states[SocketLobbyState.LOBBIES_STATE];
  const lobbiesClone = _.cloneDeep(lobbies);

  lobbiesClone.push(newLobby);
  setLobbies(lobbiesClone);
};

const updateLobby = (data: Lobby, states: StatesRecord) => {
  const [lobbies, setLobbies] = states[SocketLobbyState.LOBBIES_STATE];
  const lobbiesClone = _.cloneDeep(lobbies);

  const lobbyIndex = lobbiesClone.findIndex((l) => l.id === data.id);
  if (lobbyIndex === -1) return;

  lobbiesClone[lobbyIndex] = data;
  setLobbies(lobbiesClone);
};

const deleteLobby = (data: { targetId: number }, states: StatesRecord) => {
  const [lobbies, setLobbies] = states[SocketLobbyState.LOBBIES_STATE];
  const lobbiesClone = _.cloneDeep(lobbies).filter((lobby) => {
    return lobby.id !== data.targetId;
  });

  setLobbies(lobbiesClone);
};

export const lobbySocketHandlers: LobbySocketHandlersRecord = {
  LOBBY_LIST: initLobbyList,
  CREATE_LOBBY: createLobby,
  UPDATE_LOBBY: updateLobby,
  DELETE_LOBBY: deleteLobby,
};
