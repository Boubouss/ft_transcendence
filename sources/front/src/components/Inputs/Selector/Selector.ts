import {
  selectorButtonStyle,
  selectorContainerStyle,
  selectorLabelStyle,
} from "./style";
import { useState } from "#core/hooks/useState.ts";
import { createElement } from "#core/render.ts";

const Selector = (props: {
  values: number[];
  value: number;
  setValue: (toSet: number) => void;
}) => {
  const [index, setIndex] = useState(
    Math.max(0, props.values.indexOf(props.value))
  );

  return createElement(
    "div",
    { class: selectorContainerStyle },
    createElement("input", {
      class: selectorButtonStyle + ` border-l-[2px] rounded-l-[8px]`,
      type: `button`,
      value: `<<`,
      onClick: () => {
        const newIndex = 0;
        props.setValue(props.values[newIndex]);
        setIndex(newIndex);
      },
    }),
    createElement("input", {
      class: selectorButtonStyle,
      type: `button`,
      value: `<`,
      onClick: () => {
        const newIndex = Math.max(0, index - 1);
        props.setValue(props.values[newIndex]);
        setIndex(newIndex);
      },
    }),
    createElement("div", { class: selectorLabelStyle }, `${props.value}`),
    createElement("input", {
      class: selectorButtonStyle,
      type: `button`,
      value: `>`,
      onClick: () => {
        const newIndex = Math.min(props.values.length - 1, index + 1);
        props.setValue(props.values[newIndex]);
        setIndex(newIndex);
      },
    }),
    createElement("input", {
      class: selectorButtonStyle + ` border-r-[2px] rounded-r-[8px]`,
      type: `button`,
      value: `>>`,
      onClick: () => {
        const newIndex = props.values.length - 1;
        props.setValue(props.values[newIndex]);
        setIndex(newIndex);
      },
    })
  );
};

export default Selector;
