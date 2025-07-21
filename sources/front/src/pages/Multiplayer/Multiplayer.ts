import { createElement, useEffect, useRef, useState } from "#core/framework.ts";
import NavigationBar from "#components/NavigationBar/NavigationBar.ts";
import ModalLobby from "#components/Modals/ModalLobby/ModalLobby.ts";
import LobbyList from "#components/Lists/LobbyList/LobbyList.ts";
import { lobbySocketHandlers } from "#services/lobby.ts";
import { handleSocket } from "#services/socket.ts";
import { getStorage } from "#services/data.ts";
import type { Lobby } from "#types/lobby.ts";
import type { User } from "#types/user.ts";
import * as style from "./style";
import _ from "lodash";

export type UserState = [User | null, (value: User | null) => void];
export type LobbiesState = [Lobby[], (value: Lobby[]) => void];
export type CurrentLobbyState = [Lobby | null, (value: Lobby | null) => void];

const Multiplayer = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentLobby, setCurrentLobby] = useState<Lobby | null>(null);

  useEffect(() => {
    const storedUser = getStorage(sessionStorage, "transcendence_user");

    setUser(storedUser);
  }, []);

  useEffect(() => {
    if (_.isEmpty(user)) return;

    const configuration = getStorage(localStorage, "transcendence_conf");
    socketRef.current = new WebSocket(
      `${import.meta.env.VITE_LOBBY_WSS}/${user.id}`,
      [configuration.token],
    );

    socketRef.current.onclose = () => console.log("Close");
  }, [user]);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.onmessage = (event) => {
      handleSocket(event, lobbySocketHandlers, {
        LOBBIES_STATE: [lobbies, setLobbies],
      });
    };

    return () => {
      if (!socketRef.current) return;

      socketRef.current.close();
    };
  }, [lobbies, socketRef]);

  return createElement(
    "div",
    { id: "multiplayer", class: style.multi_background },
    NavigationBar({ userState: { user, setUser } }),
    createElement(
      "div",
      { class: "w-full h-full px-[50px] pb-[50px]" },
      LobbyList({
        lobbies,
        currentLobby,
        showModalState: [showModal, setShowModal],
      }),
    ),
    ModalLobby({
      showModalState: [showModal, setShowModal],
      lobbySocket: socketRef.current,
    }),
  );
};

export default Multiplayer;
