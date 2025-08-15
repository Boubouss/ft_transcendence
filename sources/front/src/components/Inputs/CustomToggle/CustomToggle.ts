import { type ComponentAttr } from "#core/framework.ts";
import { createElement } from "#core/render.ts";
import Input from "../Input";

import { input_default, span_off, span_on, toggle_default } from "./style";

const CustomToggle = (props: {
  InputAttr?: ComponentAttr;
  ToggleAttr?: ComponentAttr;
}) => {
  let { InputAttr, ToggleAttr } = props;

  const default_inputattr = {
    type: "checkbox",
    class: input_default,
    name: "toggle_default",
    value: "true",
  };

  const default_toggleattr = {
    class: toggle_default,
  };

  ToggleAttr = { ...default_toggleattr, ...ToggleAttr };
  InputAttr = { ...default_inputattr, ...InputAttr };

  return Input(
    {
      attr: InputAttr,
    },
    createElement(
      "div",
      ToggleAttr,
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
