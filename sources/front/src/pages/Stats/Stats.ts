import { createElement, useState, useEffect } from "#core/framework";
import type { Match, Player } from "#types/match.ts";
import MatchCard from "#components/Card/MatchCard/MatchCard.ts";
import { getMatches, getPlayers } from "#requests/matchesRequest.ts";
import List from "#components/Lists/List.ts";
import NavigationBar from "#components/NavigationBar/NavigationBar.ts";
import { home_background } from "../Home/style";
import { section_title, wrapper } from "./style";
import { useLanguage } from "#hooks/useLanguage.ts";

const Stats = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    getMatches(setMatches);
  }, []);

  useEffect(() => {
    getPlayers(matches, setPlayers);
  }, [matches]);

  return createElement(
    "div",
    { class: home_background },
    NavigationBar({}),

    createElement("h1", { class: section_title }, useLanguage("history")),
    List(
      { attr: { class: wrapper } },
      MatchCard,
      matches.map((match) => {
        return { match, players };
      }) 
    )
  );
};

export default Stats;
