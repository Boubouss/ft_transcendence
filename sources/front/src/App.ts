import { createElement } from "#core/render";
import Home from "./pages/Home";

function App() {
  return createElement("div", { id: "app" }, Home());
}

export default App;
