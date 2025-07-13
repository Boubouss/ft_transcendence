import { resetEffects } from "./hooks/useEffect";
import { routes } from "../routes.ts";
import { reRender } from "./render";

window.addEventListener("popstate", () => {
	resetEffects();
	reRender();
});

export function router() {
	const route = routes[window.location.pathname];

	if (!route) {
		return routes["/404"].component();
	} else if (route.protected) {
		// Check for auth in storage
	}

	return route.component();
}

export function navigateTo(path: string) {
	window.history.pushState({}, "", path);
	resetEffects();
	reRender();
}
