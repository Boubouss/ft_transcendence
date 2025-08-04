import { PlayerScore } from "../type/Type";

export const requestGameEnd = (
  gameId: string,
  winnerId: number,
  playerScores: PlayerScore[],
) => {
  fetch(`${process.env.API_GAME}/match/end/${gameId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ winner_id: winnerId, infos: playerScores }),
  }).catch((err) => console.error(err));
};

export const requestGameDelete = (gameId: string) => {
  fetch(`${process.env.API_GAME}/match/${gameId}`, {
    method: "DELETE",
  }).catch((err) => console.error(err));
}
