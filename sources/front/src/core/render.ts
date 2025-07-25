import { handleEffects, resetEffectIndex } from "./hooks/useEffect";
import type { Component, ComponentAttr } from "./framework";
import App from "../App.ts";

export function createElement(
  type: string,
  attr: ComponentAttr | null,
  ...children: Component[]
) {
  return { type, attr, children } as Component;
}

export function render(component: Component, container: HTMLElement) {
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
  if (!component || typeof component === "string" || !component.attr) return;

  for (const [key, value] of Object.entries(component.attr)) {
    switch (key) {
      case "onClick":
        element.onclick = () => (value as () => void)();
        break;
      case "ref":
        const refsValue = value as { current: HTMLElement | null };
        refsValue.current = element;
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
  if (!component) return;

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

  component.children?.forEach((child: Component) => {
    renderComponent(child, element);
  });

  container.appendChild(element);
}
