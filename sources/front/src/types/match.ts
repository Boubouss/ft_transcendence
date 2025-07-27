export interface MatchPlayer {
  match_id: number;
  player_id: number;
  score: number;
}

export interface Match {
  id: number;
  winner_id: number | null;
  round_id: number | null;
  created_at: string;
  updated_at: string;
  players: MatchPlayer[];
}

export interface Player {
  id: number;
  name: string;
  avatar: string;
}

export interface Round {
  id: number;
  matches: Match[];
  tournament_id: number;
  depth: number;
}

export interface Tournament {
  id: number;
  rounds: Round[];
  created_at: string;
  updated_at: string;
}
