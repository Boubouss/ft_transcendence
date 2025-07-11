import { createElement, useState, useEffect } from "#src/core/framework";
import type { Match } from "#src/types/match.ts";
import MatchCard from "#src/components/Match/MatchCard.ts";
import { getMatches } from "#src/requests/authRequest.ts";


// const testMatches: Match[] = [
//   {
//     id: 1,
//     winner_id: null,
//     round_id: null,
//     created_at: "2025-07-11T17:17:19.429Z",
//     updated_at: "2025-07-11T17:17:19.429Z",
//     players: [
//       { match_id: 1, player_id: 1, score: 0 },
//       { match_id: 1, player_id: 2, score: 0 }
//     ]
//   },
//   {
//     id: 2,
//     winner_id: null,
//     round_id: null,
//     created_at: "2025-07-13T13:34:07.956Z",
//     updated_at: "2025-07-13T13:34:07.956Z",
//     players: [
//       { match_id: 2, player_id: 1, score: 0 },
//       { match_id: 2, player_id: 2, score: 0 }
//     ]
//   }
// ];

export const curr_id: number = 1;

const Stats = () => 
{
    const [matches, setMatches] = useState<Match[]>([]);

    useEffect(() => {
        getMatches()
            .then(data => setMatches(data))
            .catch(err => console.error(err));
    }, []);

    return createElement(
        "div", {}, 
        createElement("h1", null, "Page d'affichage des statistiques !"),
        ...matches.map((match : Match) => MatchCard(match))
    );
};

export default Stats;