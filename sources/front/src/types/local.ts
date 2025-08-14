export type GameMode = "versus" | "tournament";

export type GameConfig = {
  mode: string;
  score: number;
  players?: string[];
} | null;

export type GameStage = "game" | "tree" | null;
