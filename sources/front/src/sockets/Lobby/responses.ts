import { LobbyClientEvent, SocketLobbyState } from "#types/lobby.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import type { Match, Player } from "#types/match.ts";
import type { Lobby } from "#types/lobby.ts";
import _ from "lodash";

import type {
  CurrentLobbyIdState,
  GameUrlState,
  LobbiesState,
  MatchState,
  NextOpponentsState,
  TournamentWonState,
  UserState,
} from "#pages/Multiplayer/Multiplayer.ts";

export type StatesRecord = Record<
  SocketLobbyState,
  | UserState
  | LobbiesState
  | GameUrlState
  | CurrentLobbyIdState
  | NextOpponentsState
  | MatchState
  | TournamentWonState
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
  const [_currentLobby, setCurrentLobby] = states[
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

const launchGame = (data: { gameId: number }, states: StatesRecord) => {
  const [user, _setUser] = states[SocketLobbyState.USER_STATE] as UserState;
  if (_.isEmpty(user)) return console.error("Error: no user found.");

  const [_gameUrl, setGameUrl] = states[
    SocketLobbyState.GAME_URL_STATE
  ] as GameUrlState;

  const [nextOpponents, setNextOpponents] = states[
    SocketLobbyState.NEXT_OPPONENTS_STATE
  ] as NextOpponentsState;

  if (!_.isEmpty(nextOpponents)) {
    setNextOpponents([]);
  }

  setGameUrl(`${import.meta.env.VITE_LOGIC_WSS}/${data.gameId}/${user.id}`);
};

const waitingOpponents = (
  data: { opponents: Player[] },
  states: StatesRecord
) => {
  const [_nextOpponents, setNextOpponents] = states[
    SocketLobbyState.NEXT_OPPONENTS_STATE
  ] as NextOpponentsState;

  setNextOpponents(data.opponents);
};

const transferLobbyOwnership = (
  data: { oldId: number; newId: number },
  states: StatesRecord
) => {
  const [lobbies, setLobbies] = states[
    SocketLobbyState.LOBBIES_STATE
  ] as LobbiesState;

  const [currentLobbyId, setCurrentLobbyId] = states[
    SocketLobbyState.CURRENT_LOBBY_ID_STATE
  ] as CurrentLobbyIdState;

  const lobbiesClone = _.cloneDeep(lobbies);
  const lobby = lobbiesClone.get(data.oldId);
  if (_.isEmpty(lobby)) return console.error("Error: no lobby found.");

  lobby.id = data.newId;
  lobbiesClone.set(lobby.id, lobby);
  lobbiesClone.delete(data.oldId);

  setLobbies(lobbiesClone);

  if (currentLobbyId === data.oldId) setCurrentLobbyId(data.newId);
};

const gameResult = (
  data: { match: Match; players: Player[] },
  states: StatesRecord
) => {
  const [_match, setMatch] = states[SocketLobbyState.MATCH_STATE] as MatchState;

  for (const matchPlayer of data.match.players) {
    const player = data.players.find((p) => p.id === matchPlayer.player_id);
    if (_.isEmpty(player)) continue;

    matchPlayer.player = player;
  }

  setMatch(data.match);
};

const handleTournamentWin = (_data: null, states: StatesRecord) => {
  const [_, setTournamentWon] = states[
    SocketLobbyState.TOURNAMENT_WON_STATE
  ] as TournamentWonState;

  setTournamentWon(true);
};

const kickedFromLobby = (_data: null, _states: StatesRecord) => {
  alert(useLanguage("kicked"));
};

const errorMessage = (data: { message: string }, _states: StatesRecord) => {
  alert(useLanguage(data.message));
};

export const lobbyResponseHandlers: LobbyResponseHandlers = {
  LOBBY_LIST: initLobbyList,
  CREATE_LOBBY: createLobby,
  UPDATE_LOBBY: updateLobby,
  DELETE_LOBBY: deleteLobby,
  GAME_CREATED: launchGame,
  GAME_RESULT: gameResult,
  TOURNAMENT_WON: handleTournamentWin,
  WAITING_OPPONENTS: waitingOpponents,
  TRANSFER_OWNER: transferLobbyOwnership,
  KICKED: kickedFromLobby,
  JOINED: joinLobby,
  LEFT: leaveLobby,
  ERROR: errorMessage,
};
