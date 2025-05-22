export enum ClientEvent {
  UPDATE_LOBBY_LIST = "UPDATE_LOBBY_LIST",
  UPDATE_LOBBY_INFO = "UPDATE_LOBBY_INFO",
  LOBBY_DESTROYED = "LOBBY_DESTROYED"
}

export enum ServerEvent {
  CREATE = "CREATE",
  ACTION = "ACTION"
}

export enum Action {
  JOIN = "JOIN",
  LEAVE = "LEAVE",
}
