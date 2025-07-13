export type LobbyPlayer = {
  id: number;
  name: string;
  avatar: string;
};

export type Lobby = {
  id: number;
  name: string;
  player_limit: number;
  is_tournament: boolean;
  players: LobbyPlayer[];
  ready_ids: number[];
};
