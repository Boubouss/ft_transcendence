import { useState } from "#core/hooks/useState";
import { createElement } from "#core/render";

function App() {
  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  function handleClick2() {
    setCount2(count2 + 1);
  }

  return createElement(
    "div",
    null,
    createElement("h1", null, `Compteur: ${count}`),
    createElement("h1", null, `Compteur 2: ${count2}`),
    createElement("button", { onClick: handleClick }, "Incrémenter"),
    createElement("button", { onClick: handleClick2 }, "Incrémenter 2"),
  );
}

export default App;
