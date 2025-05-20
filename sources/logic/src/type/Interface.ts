export interface CreateGameRequestBody {
  gameId: string;
  playersId: string[];
  scoreMax: number;
}
export interface DeleteGameRequestBody {
  gameId: string;
}
