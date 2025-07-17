import { handleEffects, resetEffectIndex } from "./hooks/useEffect";
import type { Component, ComponentAttr } from "./framework";
import App from "#src/App.ts";

export function createElement(
	type: string,
	attr: ComponentAttr | null,
	...children: (string | Component)[]
) {
	return { type, attr, children } as Component;
}

export function render(component: any, container: any) {
	renderComponent(component, container);
	handleEffects();
}

export function reRender() {
	const rootContainer = document.getElementById("root")!;

	resetEffectIndex();
	rootContainer.innerHTML = "";

	render(App(), rootContainer);
}

function handleAttr(component: Component, element: HTMLElement) {
	if (!component.attr) return;

	for (const [key, value] of Object.entries(component.attr)) {
		switch (key) {
			case "onClick":
				element.onclick = () => (value as () => void)();
				break;
			default:
				element.setAttribute(key, value as string);
				break;
		}
	}
}

function renderComponent(
	component: Component,
	container: HTMLElement | DocumentFragment
) {
	if (typeof component === "string") {
		container.appendChild(document.createTextNode(component));
		return;
	}

	const element =
		component.type === "template"
			? document.createDocumentFragment()
			: document.createElement(component.type);

	if (element instanceof HTMLElement) {
		handleAttr(component, element);
	}

	component.children.forEach((child: any) => {
		renderComponent(child, element);
	});

	container.appendChild(element);
}
