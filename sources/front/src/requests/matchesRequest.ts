import {
    API_GAME_ROUTES,
    API_USER_ROUTES,
    fetchAPI,
    getStorage,
} from "#services/data.ts";
import type { Match, Player, Tournament } from "#types/match.ts";

export const getMatches = async (setMatches: (toSet: Match[]) => void) => {
    const conf = getStorage(localStorage, "transcendence_conf");

    const matches: Match[] = await fetchAPI(
        "/api/game" + API_GAME_ROUTES.MATCH + `/${conf?.id}`,
        {
            method: "GET",
            headers: { Authorization: `Bearer ` + conf?.token },
        }
    );

    if (matches) setMatches(matches);
};

export const getPlayers = async (
    matches: Match[],
    setPlayers: (toSet: Player[]) => void
) => {
    if (!matches) return;

    const ids: Set<number> = new Set();
    matches.map((match) =>
        match.players.map((player) => ids.add(player.player_id))
    );

    const data = {
        ids: Array.from(ids),
    };

    const conf = getStorage(localStorage, "transcendence_conf");
    const players: Player[] = await fetchAPI(
        import.meta.env.VITE_API_USER + API_USER_ROUTES.CRUD_PLAYERS,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ` + conf?.token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );
    if (players) setPlayers(players);
};

export const getTournaments = async (
    setTournaments: (toSet: Tournament[]) => void
) => {
    const conf = getStorage(localStorage, "transcendence_conf");

    const tournaments: Tournament[] = await fetchAPI(
        "/api/game" + API_GAME_ROUTES.TOURNAMENT + `/${conf?.id}`,
        {
            method: "GET",
            headers: { Authorization: `Bearer ` + conf?.token },
        }
    );
    if (tournaments) setTournaments(tournaments);
};
