import type { Component } from "./core/framework";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import Multiplayer from "#pages/Multiplayer/Multiplayer.ts";

type Routes = Record<string, { component: () => Component, protected?: boolean; }>;

export const routes: Routes = {
	"/": { component: Home },
	"/local": { component: NotFound },
	"/multiplayer": { component: Multiplayer, protected: true },
	"/stats": { component: NotFound },
	"/404": { component: NotFound },
};
