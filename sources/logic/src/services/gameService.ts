import { PlayerScore } from "../type/Type";

export const requestGameEnd = (
  gameId: string,
  winnerId: number,
  playerScores: PlayerScore[],
) => {
  fetch(`https://localhost:3001/match/end/${gameId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ winner_id: winnerId, infos: playerScores }),
  }).catch((err) => console.error(err));
};
