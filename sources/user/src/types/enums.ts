export enum ClientEvent {
	SEND = "SEND",
	ACCEPT = "ACCEPT",
	DECLINE = "DECLINE",
	DELETE = "DELETE",
}

export enum ServerEvent {
	UPDATE = "UPDATE",
	CONNECT = "CONNECT",
	DECONNECT = "DECONNECT",
	// REQUEST = "REQUEST",
	// ACCEPTED = "ACCEPTED",
	// DECLINED = "DECLINED",
	// DELETED = "DELETED",
	// LIST = "LIST",
	ERROR = "ERROR",
}
