import { createElement, useEffect, useRef, useState } from "#core/framework.ts";
import NavigationBar from "#components/NavigationBar/NavigationBar.ts";
import ModalLobby from "#components/Modals/ModalLobby/ModalLobby.ts";
import { lobbyResponseHandlers } from "#sockets/lobby/responses.ts";
import LobbyList from "#components/Lists/LobbyList/LobbyList.ts";
import LobbyInfos from "#components/LobbyInfos/LobbyInfos.ts";
import { handleSocket } from "#services/socket.ts";
import { getStorage } from "#services/data.ts";
import type { Lobby } from "#types/lobby.ts";
import type { User } from "#types/user.ts";
import * as style from "./style";
import _ from "lodash";

export type UserState = [User | null, (value: User | null) => void];
export type CurrentLobbyIdState = [number, (value: number) => void];

export type LobbiesState = [
	Map<number, Lobby>,
	(value: Map<number, Lobby>) => void,
];

const Multiplayer = () => {
	const socketRef = useRef<WebSocket | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [lobbies, setLobbies] = useState<Map<number, Lobby>>(new Map());
	const [showModal, setShowModal] = useState(false);
	const [currentLobbyId, setCurrentLobbyId] = useState(-1);

	useEffect(() => {
		const storedUser = getStorage(sessionStorage, "transcendence_user");

		setUser(storedUser);
	}, []);

	useEffect(() => {
		if (_.isEmpty(user)) return;

		const configuration = getStorage(localStorage, "transcendence_conf");
		socketRef.current = new WebSocket(
			`${import.meta.env.VITE_LOBBY_WSS}/${user.id}`,
			[configuration.token]
		);

		socketRef.current.onclose = () => console.log("CLOSE");
	}, [user]);

	useEffect(() => {
		if (!socketRef.current) return;

		socketRef.current.onmessage = (event) => {
			handleSocket(event, lobbyResponseHandlers, {
				USER_STATE: [user, setUser],
				LOBBIES_STATE: [lobbies, setLobbies],
				CURRENT_LOBBY_ID_STATE: [currentLobbyId, setCurrentLobbyId],
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
			!lobbies.has(currentLobbyId)
				? LobbyList({
						user,
						lobbies,
						showModalState: [showModal, setShowModal],
						lobbySocket: socketRef.current,
					})
				: LobbyInfos({
						user,
						currentLobby: lobbies.get(currentLobbyId)!,
						lobbySocket: socketRef.current,
					})
		),
		ModalLobby({
			showModalState: [showModal, setShowModal],
			lobbySocket: socketRef.current,
		})
	);
};

export default Multiplayer;
