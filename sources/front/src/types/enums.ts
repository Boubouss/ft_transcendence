export enum GameClientEvent {
	ERROR = "ERROR",
	KICKED = "KICKED",
	LOBBY_LIST = "LOBBY_LIST",
	CREATE_LOBBY = "CREATE_LOBBY",
	UPDATE_LOBBY = "UPDATE_LOBBY",
	DELETE_LOBBY = "DELETE_LOBBY",
	GAME_CREATED = "GAME_CREATED",
	WAITING_OPPONENTS = "WAITING_OPPONENTS",
}

export enum GameServerEvent {
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

export enum UserClientEvent {
	SEND = "SEND",
	ACCEPT = "ACCEPT",
	DECLINE = "DECLINE",
}

export enum UserServerEvent {
	LIST = "LIST",
	CONNECT = "CONNECT",
	DECONNECT = "DECONNECT",
	REQUEST = "REQUEST",
	ACCEPTED = "ACCEPTED",
	DECLINED = "DECLINED",
	ERROR = "ERROR",
}

export enum KeysStorage {
	CONFTRANS = "transcendence_conf",
	USERTRANS = "transcendence_user",
}

export enum Form_ID {
	A2F = "is2FA",
}
