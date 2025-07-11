import { createElement } from "#src/core/render.ts";
import { curr_id } from "#src/pages/Stats/Stats.ts";
import type { Match } from "#src/types/match.ts";
import { label, match_card, score } from "./style";

function print_winner(winnerId: number | null)
{
    if (!winnerId)
        return createElement("p", {}, "en cours")
    if (winnerId == curr_id)
        return createElement("p", {class: "uppercase "}, "won")
    else
        return createElement("p", {class: "uppercase "}, "lost")
}

function print_score(match: Match)
{
    if (match.players.length > 2)
        return createElement("span", {class: score}, `${match.players[curr_id].score} points scored`)
    else
        return createElement("span", {class: score}, `${match.players[0].score} - ${match.players[1].score}`)
}

const MatchCard = (match: Match) => {
        return createElement("div", { class: match_card}, 
                    createElement("div", {class: "flex justify-between"}, 
                        createElement("h2", {}, `Match ${match.id}`),
                        match.round_id ? createElement("span", {class: label}, "tournament") : createElement("span", {class: label}, "normal")
                    ),
                    print_score(match),
                    print_winner(match.winner_id),
            )
};

export default MatchCard;