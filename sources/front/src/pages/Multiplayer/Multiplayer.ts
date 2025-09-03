import ModalGameResult from "#components/Modals/ModalGameResult/ModalGameResult.ts";
import { createElement, useEffect, useRef, useState } from "#core/framework.ts";
import NavigationBar from "#components/NavigationBar/NavigationBar.ts";
import ModalLobby from "#components/Modals/ModalLobby/ModalLobby.ts";
import { lobbyResponseHandlers } from "#sockets/Lobby/responses.ts";
import LobbyList from "#components/Lists/LobbyList/LobbyList.ts";
import WaitingRoom from "#components/WaitingRoom/WaitingRoom.ts";
import GameWrapper from "#components/GameWrapper/GameWrapper.ts";
import LobbyInfos from "#components/LobbyInfos/LobbyInfos.ts";
import { requestAction } from "#sockets/Lobby/requests.ts";
import type { GamePlayer } from "#components/Game/Game.ts";
import { useContext } from "#core/hooks/useContext.ts";
import { Action, type Lobby } from "#types/lobby.ts";
import { handleSocket } from "#services/socket.ts";
import { getStorage } from "#services/data.ts";
import type { Match, Player } from "#types/match.ts";
import { KeysStorage } from "#types/enums.ts";
import type { User } from "#types/user.ts";
import * as style from "./style";
import _ from "lodash";
import ModalTournamentWon from "#components/Modals/ModalTournamentWon/ModalTournamentWon.ts";

export type UserState = [User | null, (value: User | null) => void];
export type CurrentLobbyIdState = [number, (value: number) => void];
export type GameUrlState = [string | null, (value: string | null) => void];
export type NextOpponentsState = [Player[], (value: Player[]) => void];
export type ScoresState = [number[], (value: number[]) => void];
export type ActivePlayersState = [string[], (value: string[]) => void];
export type MatchState = [Match | null, (value: Match | null) => void];
export type TournamentWonState = [boolean, (value: boolean) => void];

export type PlayerState = [
  GamePlayer | null,
  (value: GamePlayer | null) => void,
];

export type LobbiesState = [
  Map<number, Lobby>,
  (value: Map<number, Lobby>) => void,
];

const Multiplayer = () => {
  const lobbySocketRef = useRef<WebSocket | null>(null);
  const gameSocketRef = useRef<WebSocket | null>(null);

  const [lobbies, setLobbies] = useState<Map<number, Lobby>>(new Map());
  const [gameUrl, setGameUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [tournamentWon, setTournamentWon] = useState(false);
  const [currentLobbyId, setCurrentLobbyId] = useState(-1);
  const [nextOpponents, setNextOpponents] = useState<Player[]>([]);
  const [scores, setScores] = useState<number[]>([0, 0]);
  const [player, setPlayer] = useState<GamePlayer | null>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const [activePlayers, setActivePlayers] = useState<string[]>([]);

  const [getContext, setContext] = useContext();
  const [user, setUser] = getContext("user") as UserState;

  setContext("activePlayers", [activePlayers, setActivePlayers]);

  useEffect(() => {
    if (_.isEmpty(user)) return;

    const configuration = getStorage(localStorage, KeysStorage.CONFTRANS);
    lobbySocketRef.current = new WebSocket(
      `${import.meta.env.VITE_LOBBY_WSS}/${user.id}`,
      [configuration.token]
    );

    lobbySocketRef.current.onclose = () => handleSocketClose();
  }, [user]);

  useEffect(() => {
    if (!lobbySocketRef.current) return;

    lobbySocketRef.current.onmessage = (event) => {
      handleSocket(event, lobbyResponseHandlers, {
        USER_STATE: [user, setUser],
        LOBBIES_STATE: [lobbies, setLobbies],
        GAME_URL_STATE: [gameUrl, setGameUrl],
        CURRENT_LOBBY_ID_STATE: [currentLobbyId, setCurrentLobbyId],
        NEXT_OPPONENTS_STATE: [nextOpponents, setNextOpponents],
        TOURNAMENT_WON_STATE: [tournamentWon, setTournamentWon],
        MATCH_STATE: [match, setMatch],
      });
    };

    return () => {
      if (!lobbySocketRef.current) return;

      lobbySocketRef.current.close();
    };
  }, [user, lobbies, gameUrl, currentLobbyId, nextOpponents, lobbySocketRef]);

  const handleLeave = () => {
    requestAction(lobbySocketRef.current, Action.LEAVE, currentLobbyId);
  };

  const handleSocketClose = () => {
    lobbySocketRef.current = null;
  };

  const getMainContent = () => {
    if (_.isEmpty(user)) return false;

    if (gameUrl) {
      let playerIdName;

      if (lobbies.has(currentLobbyId)) {
        playerIdName = new Map(
          lobbies.get(currentLobbyId)!.players.map((p) => {
            return [p.id.toString(), p.name];
          })
        );
      }

      return GameWrapper({
        userId: user?.id as number,
        gameSocketRef,
        playerIdName,
        gameUrlState: [gameUrl, setGameUrl],
        scoresState: [scores, setScores],
        playerState: [player, setPlayer],
      });
    } else if (_.isEmpty(gameUrl) && !_.isEmpty(nextOpponents)) {
      return WaitingRoom({ nextOpponents, handleLeave });
    } else if (_.isEmpty(gameUrl) && lobbies.has(currentLobbyId)) {
      return LobbyInfos({
        user,
        currentLobby: lobbies.get(currentLobbyId)!,
        lobbySocket: lobbySocketRef.current,
        handleLeave,
      });
    }

    return LobbyList({
      user,
      lobbies,
      showModalState: [showModal, setShowModal],
      lobbySocket: lobbySocketRef.current,
    });
  };

  return createElement(
    "div",
    { id: "multiplayer", class: style.multi_background },
    NavigationBar({}),
    createElement(
      "div",
      { class: "flex flex-auto px-[50px] pb-[50px]" },
      getMainContent()
    ),
    ModalLobby({
      showModalState: [showModal, setShowModal],
      lobbySocket: lobbySocketRef.current,
    }),
    ModalGameResult({
      user,
      matchState: [match, setMatch],
    }),
    ModalTournamentWon({
      user,
      tournamentWonState: [tournamentWon, setTournamentWon],
    })
  );
};

export default Multiplayer;
