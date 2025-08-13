import { createElement, router } from "#core/framework.ts";

function App() {
  return createElement("template", null, router());
}

export default App;
