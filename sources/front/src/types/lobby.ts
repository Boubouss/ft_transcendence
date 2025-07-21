export enum ClientLobbyEvent {
  // ERROR = "ERROR",
  // KICKED = "KICKED",
  LOBBY_LIST = "LOBBY_LIST",
  CREATE_LOBBY = "CREATE_LOBBY",
  UPDATE_LOBBY = "UPDATE_LOBBY",
  DELETE_LOBBY = "DELETE_LOBBY",
  // GAME_CREATED = "GAME_CREATED",
  // WAITING_OPPONENTS = "WAITING_OPPONENTS",
}

export enum ServerLobbyEvent {
  CREATE = "CREATE",
  ACTION = "ACTION",
}

export enum Action {
  JOIN = "JOIN",
  LEAVE = "LEAVE",
  LAUNCH = "LAUNCH",
  KICK = "KICK",
  SWITCH_READY = "SWITCH_READY",
}

export enum SocketLobbyState {
  LOBBIES_STATE = "LOBBIES_STATE",
  // CURRENT_LOBBY_STATE = "CURRENT_LOBBY_STATE",
}

export type LobbyPlayer = {
  id: number;
  name: string;
  avatar: string;
};

export type Lobby = {
  id: number;
  name: string;
  player_limit: number;
  is_tournament: boolean;
  players: LobbyPlayer[];
  ready_ids: number[];
};

export type LobbyCreate = {
  player_limit: number;
  is_tournament?: boolean;
};

export type LobbyPlayerAction = {
  target_id: number;
  player_id?: number;
  action: Action;
};
