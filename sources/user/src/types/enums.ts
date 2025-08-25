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
	SENT = "SENT",
	// REQUEST = "REQUEST",
	// ACCEPTED = "ACCEPTED",
	// DECLINED = "DECLINED",
	// DELETED = "DELETED",
	// LIST = "LIST",
	ERROR = "ERROR",
}
