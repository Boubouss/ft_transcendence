import { createElement } from "#core/render.ts";
import { getStorage } from "#services/data.ts";
import type { Match, Player } from "#types/match.ts";
import Score from "./Score";
import { label, match_card } from "../style";
import Card from "../Card";
import { useLanguage } from "#hooks/useLanguage.ts";

const MatchCard = (props: { match: Match; players: Player[] }) => {
    const user = getStorage(sessionStorage, "transcendence_user");

    const { match, players } = props;

    const winner = match.winner_id;
    const date = new Date(match.created_at);
    const formatted = date.toLocaleDateString(useLanguage("timezone"), {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    let result_label = "uppercase";
    let result = "";

    if (winner) {
        if (winner === user?.id) {
            result_label += " text-green-600";
            result = useLanguage("win");
        } else {
            result_label += " text-red-600";
            result = useLanguage("loss");
        }
    } else {
        result = useLanguage("ongoing");
    }

    return Card(
        { class: match_card },
        createElement(
            "div",
            { class: "flex justify-between " },
            createElement("span", { class: result_label }, result),
            match.round_id
                ? createElement(
                      "img",
                      {
                          class: label,
                          src: "../../../../public/icons/tournament_icon.png",
                      },
                      "tournament"
                  )
                : createElement(
                      "img",
                      {
                          class: label,
                          src: "../../../../public/icons/dual_icon.png",
                      },
                      "duel"
                  ),
            createElement("span", { class: "text-sm" }, `${formatted}`)
        ),
        Score({ match, players, userID: user?.id })
    );
};

export default MatchCard;
