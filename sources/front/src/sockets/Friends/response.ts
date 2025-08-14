import { useLanguage } from "#hooks/useLanguage.ts";
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
  (data: Friendship | { message: string }, states: FriendsStates) => void
> = {
  UPDATE: handleUpdateFriend,
  SENT: handleSentFriend,
  ERROR: handleErrorFriend,
};

function handleSentFriend(
  _data: Friendship | { message: string },
  _states: FriendsStates
) {
  alert(useLanguage("send_request"));
}

function handleUpdateFriend(
  data: Friendship | { message: string },
  states: FriendsStates
) {
  const { FRIENDSHIP: state } = states;
  state[1](data);
}

function handleErrorFriend(
  data: Friendship | { message: string },
  _states: FriendsStates
) {
  console.log(data);
}
