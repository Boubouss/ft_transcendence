import { createElement } from "#core/render.ts";
import Card from "../Card";

const TextCard = (props: { name: string; score: number }) => {
  let { name, score } = props;

  return Card(
    { class: "w-full flex gap-6 justify-between text-sm" },
    createElement("span", {}, `${name}`),
    createElement("span", {}, `${score}`)
  );
};

export default TextCard;
