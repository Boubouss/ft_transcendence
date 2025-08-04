import type { UserServerEvent } from "#types/enums.ts";
import type { Friendship } from "#types/user.ts";

export enum FriendsStatesNames {
  FRIENDSHIP = "FRIENDSHIP",
}

export type FriendsStates = Record<
  FriendsStatesNames,
  [getter: any, setter: (toSet: any) => void]
>;

export const friendHandlers: Record<
  UserServerEvent,
  (data: Friendship, states: FriendsStates) => void
> = {
  UPDATE: handleUpdateFriend,
  ERROR: handleErrorFriend,
};

function handleUpdateFriend(data: Friendship, states: FriendsStates) {
  const { FRIENDSHIP: state } = states;
  state[1](data);
}

function handleErrorFriend(data: Friendship, _states: FriendsStates) {
  console.error(data);
}
