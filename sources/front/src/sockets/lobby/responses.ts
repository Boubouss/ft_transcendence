import { LobbyClientEvent, SocketLobbyState } from "#types/lobby.ts";
import type { Lobby } from "#types/lobby.ts";
import _ from "lodash";

import type {
  CurrentLobbyIdState,
  LobbiesState,
  UserState,
} from "#pages/Multiplayer/Multiplayer.ts";

export type StatesRecord = Record<
  SocketLobbyState,
  UserState | LobbiesState | CurrentLobbyIdState
>;

export type LobbyResponseHandlers = Record<
  LobbyClientEvent,
  (data: any, states: StatesRecord) => void
>;

const initLobbyList = (data: Lobby[], states: StatesRecord) => {
  const [_, setLobbies] = states[
    SocketLobbyState.LOBBIES_STATE
  ] as LobbiesState;

  const lobbies = new Map(data.map((l) => [l.id, l]));

  setLobbies(lobbies);
};

const createLobby = (newLobby: Lobby, states: StatesRecord) => {
  const [lobbies, setLobbies] = states[
    SocketLobbyState.LOBBIES_STATE
  ] as LobbiesState;

  const lobbiesClone = _.cloneDeep(lobbies);
  console.log(lobbiesClone);

  lobbiesClone.set(newLobby.id, newLobby);
  setLobbies(lobbiesClone);
};

const updateLobby = (updatedLobby: Lobby, states: StatesRecord) => {
  const [lobbies, setLobbies] = states[
    SocketLobbyState.LOBBIES_STATE
  ] as LobbiesState;

  const lobbiesClone = _.cloneDeep(lobbies);
  lobbiesClone.set(updatedLobby.id, updatedLobby);

  setLobbies(lobbiesClone);
};

const deleteLobby = (data: { target_id: number }, states: StatesRecord) => {
  const [lobbies, setLobbies] = states[
    SocketLobbyState.LOBBIES_STATE
  ] as LobbiesState;

  const lobbiesClone = _.cloneDeep(lobbies);
  lobbiesClone.delete(data.target_id);

  setLobbies(lobbiesClone);
};

const joinLobby = (data: { target_id: number }, states: StatesRecord) => {
  const [_, setCurrentLobby] = states[
    SocketLobbyState.CURRENT_LOBBY_ID_STATE
  ] as CurrentLobbyIdState;

  setCurrentLobby(data.target_id);
};

const leaveLobby = (data: Lobby, states: StatesRecord) => {
  const [_currentLobby, setCurrentLobby] = states[
    SocketLobbyState.CURRENT_LOBBY_ID_STATE
  ] as CurrentLobbyIdState;

  updateLobby(data, states);
  setCurrentLobby(-1);
};

export const lobbyResponseHandlers: LobbyResponseHandlers = {
  LOBBY_LIST: initLobbyList,
  CREATE_LOBBY: createLobby,
  UPDATE_LOBBY: updateLobby,
  DELETE_LOBBY: deleteLobby,
  JOINED: joinLobby,
  LEFT: leaveLobby,
};
