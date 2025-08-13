import { useLanguage } from "#hooks/useLanguage.ts";
import { getStorage } from "#services/data.ts";
import { KeysStorage, UserClientEvent } from "#types/enums.ts";
import type { Friend, Friendship } from "#types/user.ts";
import _ from "lodash";

export function handleSendFriendRequest(
  props: {
    getter: Friendship | null;
    setter: (toSet: Friendship | null) => void;
    socket?: WebSocket | null;
  },
  form: FormData | null
) {
  const user = getStorage(sessionStorage, KeysStorage.USERTRANS);
  const { socket, getter: friends } = props;
  const target = form?.get("name");

  if (friends?.requests?.find((f) => f.name === target)) {
    socket?.send(JSON.stringify({ event: UserClientEvent.ACCEPT, target }));
    return;
  }

  if (
    _.isEmpty(target) ||
    user.name === target ||
    friends?.online?.find((f) => f.name === target) ||
    friends?.offline?.find((f) => f.name === target) ||
    friends?.sent?.find((f) => f.name === target)
  )
    return;

  socket?.send(JSON.stringify({ event: UserClientEvent.SEND, target }));
  alert(useLanguage("send_request"));
}

export function handleAcceptFriendRequest(props: {
  target: Friend;
  state: {
    getter: Friendship | null;
    setter: (toSet: Friendship | null) => void;
    socket?: WebSocket | null;
  };
}) {
  const { target } = props;
  const { socket } = props.state;

  socket?.send(
    JSON.stringify({ event: UserClientEvent.ACCEPT, target: target.name })
  );
}

export function handleDeclineFriendRequest(props: {
  target: Friend;
  state: {
    getter: Friendship | null;
    setter: (toSet: Friendship | null) => void;
    socket?: WebSocket | null;
  };
}) {
  const { target } = props;
  const { socket } = props.state;

  socket?.send(
    JSON.stringify({ event: UserClientEvent.DECLINE, target: target.name })
  );
}

export function handleDeleteFriend(props: {
  target: Friend;
  state: {
    getter: Friendship | null;
    setter: (toSet: Friendship | null) => void;
    socket?: WebSocket | null;
  };
}) {
  const { target } = props;
  const { socket } = props.state;

  socket?.send(
    JSON.stringify({ event: UserClientEvent.DELETE, target: target.name })
  );
}
