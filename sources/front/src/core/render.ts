import NotFound from "#src/pages/NotFound.ts";
import { routes } from "#src/routes.ts";
import { handleEffects, resetEffectIndex } from "./hooks/useEffect";

export function createElement(type: any, props: any, ...children: any) {
	return { type, props, children };
}

export function renderComponent(component: any, container: any) {
	if (typeof component === "string") {
		container.appendChild(document.createTextNode(component));
		return;
	}

	const element = document.createElement(component.type);

	if (component.props) {
		Object.keys(component.props).forEach((key) => {
			element.setAttribute(key, component.props[key]);
			if (key.toLowerCase() === "onclick") {
				element.onclick = () => component.props[key]();
			}
		});
	}

	component.children.forEach((child: any) => {
		renderComponent(child, element);
	});

	container.appendChild(element);
}

export function render(component: any, container: any) {
	renderComponent(component, container);
	handleEffects();
}

export function reRender() {
	resetEffectIndex();
	document.getElementById("app")!.innerHTML = "";
	const path = window.location.pathname;
	// console.log(path);
	if (routes[path])
		render(routes[path].component(), document.getElementById("app"));
	else render(NotFound(), document.getElementById("app"));
}
