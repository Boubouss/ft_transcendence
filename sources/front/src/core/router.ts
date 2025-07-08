import { routes } from "#src/routes.ts";
import { render } from "./render";

window.addEventListener("popstate", () => {
	document.getElementById("app")!.innerHTML = "";
	render(
		routes[window.location.pathname]
			? routes[window.location.pathname].component()
			: routes["/404"].component(),
		document.getElementById("app")
	);
});

export function navigateTo(path: string) {
	window.history.pushState({}, "", path);
	document.getElementById("app")!.innerHTML = "";
	render(
		routes[path] ? routes[path].component() : routes["/404"].component(),
		document.getElementById("app")
	);
}
