import type { Component } from "./core/framework";
import Account from "./pages/Account/Account";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";

type Routes = Record<string, { component: () => Component }>;

export const routes: Routes = {
	"/": { component: Home },
	"/local": { component: NotFound },
	"/lobby": { component: NotFound },
	"/stats": { component: NotFound },
	"/account": {component: Account},
	"/404": { component: NotFound },
};
