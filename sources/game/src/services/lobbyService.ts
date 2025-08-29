import { lobbies, players, sockets } from "#routes/lobby";
import { initTournament } from "./tournamentService";
import { Action, ClientEvent } from "#types/enums";
import { initGameInstance } from "./matchService";
import axios from "axios";
import _ from "lodash";

import {
  isLobbyCreate,
  isLobbyPlayerAction,
  Lobby,
  LobbyCreate,
  LobbyPlayer,
  LobbyPlayerAction,
} from "#types/lobby";

export const broadcastData = (data: string) => {
  players.forEach((player) => {
    const playerSocket = sockets.get(player.id);
    if (_.isEmpty(playerSocket)) return;

    playerSocket.send(data);
  });
};

export const emitLobbyData = (lobby: Lobby, data: string) => {
  lobby.players.forEach((player) => {
    const playerSocket = sockets.get(player.id);
    if (_.isEmpty(playerSocket)) return;

    playerSocket.send(data);
  });
};

export const whisperData = (player_ids: number[], data: string) => {
  player_ids.forEach((id) => {
    const playerSocket = sockets.get(id);
    if (_.isEmpty(playerSocket)) return;

    playerSocket.send(data);
  });
};

export const findPlayerLobby = (playerId: number) => {
  if (playerId === -1) return undefined;

  return lobbies.find((lobby) => {
    return lobby.players.find((p) => p.id === playerId);
  });
};

export const getLobbyPlayer = async (
  user_id: string,
  socket: WebSocket,
  token?: string,
) => {
  try {
    const { data } = await axios.get(
      `${process.env.API_USER}/crud/user/${user_id}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    delete data.email;
    delete data.configuration;

    players.push(data as LobbyPlayer);
    socket.send(
      JSON.stringify({ event: ClientEvent.LOBBY_LIST, data: lobbies }),
    );
  } catch (err) {
    let message: string;

    if (axios.isAxiosError(err)) {
      message = err.message;
    } else {
      message = JSON.stringify(`Error: ${err}`);
    }

    socket.send(
      JSON.stringify({
        event: ClientEvent.ERROR,
        data: { message },
      }),
    );

    socket.close();
  }
};

const joinLobby = (lobby: Lobby, player: LobbyPlayer) => {
  if (!lobby.joinable) {
    return whisperData(
      [player.id],
      JSON.stringify({
        event: ClientEvent.ERROR,
        data: { message: "not_joinable" },
      }),
    );
  }

  if (lobby.player_limit <= lobby.players.length) {
    return whisperData(
      [player.id],
      JSON.stringify({
        event: ClientEvent.ERROR,
        data: { message: "full_lobby" },
      }),
    );
  }

  const playerLobby = findPlayerLobby(player.id);

  if (!_.isEmpty(playerLobby)) {
    return whisperData(
      [player.id],
      JSON.stringify({
        event: ClientEvent.ERROR,
        data: { message: "already_inside_lobby" },
      }),
    );
  }

  lobby.players.push(player);

  emitLobbyData(
    lobby,
    JSON.stringify({ event: ClientEvent.UPDATE_LOBBY, data: lobby }),
  );

  whisperData(
    [player.id],
    JSON.stringify({
      event: ClientEvent.JOINED,
      data: { target_id: lobby.id },
    }),
  );
};

const transferOwnership = (lobby: Lobby, newOwner: LobbyPlayer) => {
  emitLobbyData(
    lobby,
    JSON.stringify({
      event: ClientEvent.TRANSFER_OWNER,
      data: { oldId: lobby.id, newId: newOwner.id },
    }),
  );

  lobby.id = newOwner.id;
};

export const leaveLobby = (lobby: Lobby, player: LobbyPlayer) => {
  if (lobby.players.length <= 1) return destroyLobby(lobby);

  lobby.players = lobby.players.filter((p) => p.id !== player.id);
  lobby.ready_ids = lobby.ready_ids.filter((id) => id !== player.id);

  emitLobbyData(
    lobby,
    JSON.stringify({ event: ClientEvent.UPDATE_LOBBY, data: lobby }),
  );

  if (lobby.id === player.id) transferOwnership(lobby, _.first(lobby.players)!);

  whisperData(
    [player.id],
    JSON.stringify({ event: ClientEvent.LEFT, data: lobby }),
  );

  whisperData(
    [player.id],
    JSON.stringify({ event: ClientEvent.LOBBY_LIST, data: lobbies }),
  );
};

const launchGame = (lobby: Lobby, player: LobbyPlayer) => {
  if (lobby.id !== player.id) {
    return whisperData(
      [player.id],
      JSON.stringify({
        event: ClientEvent.ERROR,
        data: { message: "only_owner_launch" },
      }),
    );
  } else if (lobby.ready_ids.length < lobby.player_limit) {
    return whisperData(
      [player.id],
      JSON.stringify({
        event: ClientEvent.ERROR,
        data: {
          message: "all_not_ready",
        },
      }),
    );
  }

  if (lobby.is_tournament) {
    initTournament(lobby);
  } else {
    initGameInstance(lobby);
  }
};

const switchReady = (lobby: Lobby, player: LobbyPlayer) => {
  const isReady = lobby.ready_ids.includes(player.id);

  if (!isReady) {
    lobby.ready_ids.push(player.id);
  } else {
    lobby.ready_ids = lobby.ready_ids.filter((id) => id !== player.id);
  }

  emitLobbyData(
    lobby,
    JSON.stringify({ event: ClientEvent.UPDATE_LOBBY, data: lobby }),
  );
};

const kickLobbyPlayer = (
  lobby: Lobby,
  owner: LobbyPlayer,
  targetId?: number,
) => {
  const target = lobby.players.find((p) => p.id === targetId);

  if (_.isEmpty(target)) {
    return whisperData(
      [owner.id],
      JSON.stringify({
        event: ClientEvent.ERROR,
        data: { message: "resource_not_found" },
      }),
    );
  } else if (lobby.id !== owner.id) {
    return whisperData(
      [owner.id],
      JSON.stringify({
        event: ClientEvent.ERROR,
        data: { message: "kick_forbidden" },
      }),
    );
  }

  leaveLobby(lobby, target);
  whisperData([target.id], JSON.stringify({ event: ClientEvent.KICKED }));
};

export const handleAction = (player: LobbyPlayer, data: LobbyPlayerAction) => {
  if (!isLobbyPlayerAction(data)) {
    return whisperData(
      [player.id],
      JSON.stringify({
        event: ClientEvent.ERROR,
        data: { message: "wrong_format" },
      }),
    );
  }

  const lobby = lobbies.find((l) => l.id === data.target_id);
  if (_.isEmpty(lobby)) {
    return whisperData(
      [player.id],
      JSON.stringify({
        event: ClientEvent.ERROR,
        data: { message: "resource_not_found" },
      }),
    );
  }

  switch (data.action) {
    case Action.JOIN:
      return joinLobby(lobby, player);
    case Action.LEAVE:
      return leaveLobby(lobby, player);
    case Action.LAUNCH:
      return launchGame(lobby, player);
    case Action.KICK:
      return kickLobbyPlayer(lobby, player, data.player_id);
    case Action.SWITCH_READY:
      return switchReady(lobby, player);
    default:
      return whisperData(
        [player.id],
        JSON.stringify({
          event: ClientEvent.ERROR,
          data: { message: "Error: This action doesn't exist." },
        }),
      );
  }
};

export const createLobby = (player: LobbyPlayer, data: LobbyCreate) => {
  if (!isLobbyCreate(data)) {
    return whisperData(
      [player.id],
      JSON.stringify({
        event: ClientEvent.ERROR,
        data: { message: "wrong_format" },
      }),
    );
  }

  let lobby = lobbies.find((l) => l.id === player.id);
  if (!_.isEmpty(lobby)) {
    return whisperData(
      [player.id],
      JSON.stringify({
        event: ClientEvent.ERROR,
        data: { message: "already_own_lobby" },
      }),
    );
  }

  if (data.is_tournament && data.player_limit < 4) {
    return whisperData(
      [player.id],
      JSON.stringify({
        event: ClientEvent.ERROR,
        data: { message: "least_tournament_limit" },
      }),
    );
  } else if (data.player_limit < 2) {
    return whisperData(
      [player.id],
      JSON.stringify({
        event: ClientEvent.ERROR,
        data: { message: "least_player_limit" },
      }),
    );
  }

  if (data.is_tournament && Math.log2(data.player_limit) % 1 !== 0) {
    return whisperData(
      [player.id],
      JSON.stringify({
        event: ClientEvent.ERROR,
        data: { message: "pow_player_limit" },
      }),
    );
  }

  lobby = {
    id: player.id,
    name: !_.isEmpty(data.name) ? data.name : `${player.name}'s Lobby`,
    player_limit: data.player_limit,
    score_max: data.score_max,
    is_tournament: data.is_tournament,
    players: [player],
    ready_ids: [],
    joinable: true,
  };

  lobbies.push(lobby);

  broadcastData(
    JSON.stringify({ event: ClientEvent.CREATE_LOBBY, data: lobby }),
  );

  whisperData(
    [player.id],
    JSON.stringify({
      event: ClientEvent.JOINED,
      data: { target_id: lobby.id },
    }),
  );
};

export const destroyLobby = (lobby: Lobby) => {
  const lobbyIndex = lobbies.indexOf(lobby);

  lobbies.splice(lobbyIndex, 1);

  broadcastData(
    JSON.stringify({
      event: ClientEvent.DELETE_LOBBY,
      data: { target_id: lobby.id },
    }),
  );
};
