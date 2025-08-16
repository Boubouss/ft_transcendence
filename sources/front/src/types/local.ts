export type LocalConfig = {
  mode: string;
  score: number;
  players: string[];
} | null;

export type LocalMode = "versus" | "tournament";

export type LocalTournament = {
  id: string; //todo: should be removed
  stage: "game" | "queue" | "finished";
  players: string[];
  score: number;
  queue: string[];
  current: string[] | null;
} | null;
