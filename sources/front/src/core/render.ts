import App from "#src/App.ts";

export let currentStateId = 0;
export let currentComponentId = 0;
export let componentIds: number[] = [];
export let componentStates: Map<number, any> = new Map();

export function getCurrentComponentId() {
  return componentIds[componentIds.length - 1];
}

export function setCurrentStateId(value: number) {
  currentStateId = value;
}

export function createElement(type: any, props: any, ...children: any) {
  return { type, props, children };
}

export function render(component: any, container: any) {
  if (typeof component === "string") {
    container.appendChild(document.createTextNode(component));
    return;
  }

  currentStateId = 0;
  componentIds.push(currentComponentId);
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
    render(child, element);
  });

  container.appendChild(element);
  componentIds.pop();
}

export function reRender() {
  document.getElementById("app")!.innerHTML = "";
  render(App(), document.getElementById("app"));
}
