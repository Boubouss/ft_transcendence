import { createElement, router } from "#core/framework";

function App() {
	return createElement("template", null, router());
}

export default App;
