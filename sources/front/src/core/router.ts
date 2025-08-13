import { resetEffects } from "./hooks/useEffect";
import { routes } from "../routes.ts";
import { reRender } from "./render";
import { resetStates } from "./hooks/useState.ts";
import { getStorage } from "#services/data.ts";
import _ from "lodash";

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
		const storedUser = getStorage(sessionStorage, "transcendence_user");

		if (_.isEmpty(storedUser)) return navigateTo("/");
	}

	return route.component();
}

export function navigateTo(path: string) {
	window.history.pushState({}, "", path);

	resetEffects();
	resetStates();
	reRender();
}
