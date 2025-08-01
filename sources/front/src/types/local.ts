export type LocalConfig = {
  mode: string;
  score: number;
  players: string[];
} | null;

export type LocalMode = "versus" | "tournament";

export type LocalTournament = {
  id: string;
  stage: "game" | "queue" | "finished";
  players: string[];
  score: number;
  queue: string[];
  current: string[] | null;
  currentMatchId: string | null;
} | null;
