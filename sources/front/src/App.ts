import { createElement } from "#core/render";
import { router } from "./core/router";

function App() {
  return createElement("template", null, router());
}

export default App;
