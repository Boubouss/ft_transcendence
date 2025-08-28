import { useEffect, useState, type Component } from "#core/framework.ts";
import { useRef } from "#core/hooks/useRef.ts";
import { createElement } from "#core/render.ts";
import { getStorage } from "#services/data.ts";
import { handleSocket } from "#services/socket.ts";
import { KeysStorage, type UserServerEvent } from "#types/enums.ts";
import type { Friendship } from "#types/user.ts";
import { friendHandlers, type FriendsStates } from "#sockets/Friends/response";
import _ from "lodash";
import { useContext } from "#core/hooks/useContext.ts";
import type { UserState } from "#pages/Multiplayer/Multiplayer.ts";

const Friends = (children: (props?: any) => Component) => {
  const [friends, setFriends] = useState<Friendship | null>(null);
  const configuration = getStorage(localStorage, KeysStorage.CONFTRANS);

  const [getContext, _set] = useContext();

  const [user, _setUser] = getContext("user") as UserState;

  const ref = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (_.isEmpty(user)) 
    {
      if (ref.current) ref.current.close();
      return;
    }

    ref.current = new WebSocket(
      `${import.meta.env.VITE_USER_WSS}/${user.id}`,
      [configuration?.token]
    );

  }, [user]);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.onmessage = (event: MessageEvent) =>
      handleSocket<UserServerEvent, FriendsStates>(
        event,
        friendHandlers,
        { FRIENDSHIP: [friends, setFriends] }
      );

    return () => {
      if (!ref.current) return ;
      ref.current.close();
    };

  }, [user, ref])

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
