import type { Component } from "./core/render";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";

type Routes = {
	[key: string]: {
		component: () => Component;
		id: string;
	};
};

export const routes: Routes = {
	"/": { component: Home, id: "home" },
	"/local": { component: NotFound, id: "local" },
	"/lobby": { component: NotFound, id: "lobby" },
	"/stats": { component: NotFound, id: "stats" },
	"/404": { component: NotFound, id: "404" },
};
