import type { UserServerEvent } from "#types/enums.ts";

export enum FriendsStatesNames {
	FRIENDSHIP = "FRIENDSHIP",
}

export type FriendsStates = Record<
	FriendsStatesNames,
	[getter: any, setter: (toSet: any) => void]
>;

export const friendHandlers: Record<
	UserServerEvent,
	(data: {}, states: FriendsStates) => void
> = {
	LIST: handleListFriend,
	CONNECT: handleConnectFriend,
	DECONNECT: handleDeconnectFriend,
	REQUEST: handleRequestFriend,
	ACCEPTED: handleAcceptFriend,
	DECLINED: handleDeclineFriend,
	ERROR: handleErrorFriend,
};

function handleListFriend(data: any, states: FriendsStates) {
	const { FRIENDSHIP: state } = states;
	state[1](data);
}

function handleConnectFriend(data: {}, states: FriendsStates) {
	console.log(data);
}

function handleDeconnectFriend(data: {}, states: FriendsStates) {
	console.log(data);
}

function handleRequestFriend(data: {}, states: FriendsStates) {
	console.log(data);
}

function handleAcceptFriend(data: {}, states: FriendsStates) {
	console.log(data);
}

function handleDeclineFriend(data: {}, states: FriendsStates) {
	console.log(data);
}

function handleErrorFriend(data: {}, states: FriendsStates) {
	console.log(data);
}
