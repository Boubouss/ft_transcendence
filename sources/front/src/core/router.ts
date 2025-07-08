import { routes } from "#src/routes.ts";
import { resetEffects } from "./hooks/useEffect";
import { reRender } from "./render";

window.addEventListener("popstate", () => {
	resetEffects();
	reRender();
});

export function router() {
	const path = window.location.pathname;

	if (!routes[path]) {
		return routes["/404"].component();
	}

	return routes[path].component();
}

export function navigateTo(path: string) {
	window.history.pushState({}, "", path);
	resetEffects();
	reRender();
}
