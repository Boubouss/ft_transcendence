import type { Component } from "#core/framework.ts";
import NotFound from "#pages/NotFound.ts";
import Home from "#pages/Home/Home.ts";
import Multiplayer from "#pages/Multiplayer/Multiplayer.ts";

type Routes = {
	[key: string]: {
		component: () => Component;
		id: string;
	};
};

export const routes: Routes = {
	"/": { component: Home, id: "home" },
	"/local": { component: NotFound, id: "local" },
	"/multiplayer": { component: Multiplayer, id: "multiplayer" },
	"/stats": { component: NotFound, id: "stats" },
	"/404": { component: NotFound, id: "404" },
};
