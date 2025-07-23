import type { Component } from "#core/framework";
import Home from "./pages/Home/Home";
import Stats from "./pages/Stats/Stats";
import NotFound from "./pages/NotFound/NotFound";
import Multiplayer from "#pages/Multiplayer/Multiplayer.ts";
import Local from "#pages/Local/Local.ts";

type Routes = Record<
	string,
	{ component: () => Component; protected?: boolean }
>;

export const routes: Routes = {
	"/": { component: Home },
	"/local": { component: Local },
	"/multiplayer": { component: Multiplayer, protected: true },
	"/stats": { component: Stats, protected: true },
	"/404": { component: NotFound },
};
