import { input_default, span_off, span_on, toggle_default } from "./style";
import { type ComponentAttr } from "#core/framework.ts";
import { createElement } from "#core/render.ts";
import Checkbox from "../Checkbox/Checkbox";

type Props = {
  externalValueRef?: { current: string };
  attr?: ComponentAttr;
  toggleAttr?: ComponentAttr;
};

const CustomToggle = ({ externalValueRef, attr, toggleAttr }: Props) => {
  const defaultAttr = {
    type: "checkbox",
    class: input_default,
    name: "toggle_default",
  };

  const defaultToggleAttr = {
    class: toggle_default,
  };

  toggleAttr = { ...defaultToggleAttr, ...toggleAttr };
  attr = { ...defaultAttr, ...attr };

  return Checkbox(
    {
      attr,
      externalValueRef,
    },
    createElement(
      "div",
      toggleAttr,
      createElement(
        "span",
        {
          class: span_on,
        },
        "ON"
      ),
      createElement(
        "span",
        {
          class: span_off,
        },
        "OFF"
      )
    )
  );
};

export default CustomToggle;
