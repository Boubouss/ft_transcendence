import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

type Routes = {
	[key: string]: {
		component: () => void;
		id: string;
	};
};

export const routes: Routes = {
	"/": { component: Home, id: "home" },
	"/404": { component: NotFound, id: "404" },
};
