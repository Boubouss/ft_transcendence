import type { Component } from "#core/framework";
import Home from "./pages/Home/Home";
import Stats from "./pages/Stats/Stats";
import NotFound from "./pages/NotFound/NotFound";

type Routes = Record<string, { component: () => Component }>;

export const routes: Routes = {
	"/": { component: Home },
	"/local": { component: NotFound },
	"/lobby": { component: NotFound },
	"/stats": { component: Stats },
	"/404": { component: NotFound },
};
