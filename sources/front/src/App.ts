import { useState } from "#core/hooks/useState";
import { createElement } from "#core/render";
import { useEffect } from "./core/hooks/useEffect";

function App() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  useEffect(() => {
    setTimeout(() => {
      setCount(1);
    }, 1000);
  }, []);

  return createElement(
    "div",
    null,
    createElement("h1", null, `Compteur: ${count}`),
    createElement("button", { onClick: handleClick }, "Incrémenter"),
  );
}

export default App;
