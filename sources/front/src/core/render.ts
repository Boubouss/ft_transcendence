import { handleEffects, resetEffectIndex } from "./hooks/useEffect";
import App from "#src/App.ts";

type ComponentProps = {
	id?: string;
	class?: string;
	onClick?: () => void;
};

export type Component = {
	type: string;
	props: ComponentProps | null;
	children: (string | Component)[];
};

export function createElement(
	type: string,
	props: ComponentProps | null,
	...children: (string | Component)[]
) {
	return { type, props, children } as Component;
}

function handleProps(component: Component, element: HTMLElement) {
	if (!component.props) return;

	for (const [key, value] of Object.entries(component.props)) {
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

export function renderComponent(
	component: Component,
	container: HTMLElement | DocumentFragment,
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
		handleProps(component, element);
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
	const rootContainer = document.getElementById("root")!;

	resetEffectIndex();
	rootContainer.innerHTML = "";

	render(App(), rootContainer);
}
