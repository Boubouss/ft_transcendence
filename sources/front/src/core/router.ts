import { resetEffects } from "./hooks/useEffect";
import { routes } from "../routes.ts";
import { reRender } from "./render";
import { resetStates } from "./hooks/useState.ts";

window.addEventListener("popstate", () => {
	resetEffects();
	resetStates();
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
	resetStates();
	reRender();
}
