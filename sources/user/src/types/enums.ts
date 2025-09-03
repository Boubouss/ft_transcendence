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
	ERROR = "ERROR",
}
