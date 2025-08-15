import { useEffect, useState, type Component } from "#core/framework.ts";
import { useRef } from "#core/hooks/useRef.ts";
import { createElement } from "#core/render.ts";
import { getStorage } from "#services/data.ts";
import { handleSocket } from "#services/socket.ts";
import { KeysStorage, type UserServerEvent } from "#types/enums.ts";
import type { Friendship } from "#types/user.ts";
import { friendHandlers, type FriendsStates } from "#sockets/Friends/response";

const Friends = (children: (props?: any) => Component) => {
  const [friends, setFriends] = useState<Friendship | null>(null);
  const user = getStorage(sessionStorage, KeysStorage.USERTRANS);
  const configuration = getStorage(localStorage, "transcendence_conf");

  const ref = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!user) return;

    const socket = new WebSocket(
      `${import.meta.env.VITE_USER_WSS}/${user.id}`,
      [configuration?.token]
    );

    ref.current = socket;

    socket.onclose = () => console.log("close");

    return () => {
      if (socket.readyState === WebSocket.OPEN) socket.close();
    };
  }, [user]);

  useEffect(() => {
    if (!ref.current) return;

    const states: FriendsStates = {
      FRIENDSHIP: [friends, setFriends],
    };

    ref.current.onmessage = (event: MessageEvent) =>
      handleSocket<UserServerEvent, FriendsStates>(
        event,
        friendHandlers,
        states
      );
  }, [user, ref]);

  return createElement(
    "template",
    null,
    children({
      getter: friends,
      setter: setFriends,
      socket: ref?.current,
    })
  );
};

export default Friends;
