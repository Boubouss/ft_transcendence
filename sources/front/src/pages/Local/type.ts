export type GameMode = "versus" | "tournament";

export type GameConfig = {
  id: string;
  mode: string;
  score: number;
  players?: string[];
} | null;

export type GameStage = "game" | "tree" | null;
