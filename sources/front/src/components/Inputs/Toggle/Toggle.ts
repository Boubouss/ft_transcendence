import { type ComponentAttr } from "#core/framework.ts";
import { createElement } from "#core/render.ts";
import Input from "../Input";

import {
  input_default,
  span_off,
  span_on,
  toggle_allowed,
  toggle_default,
  toggle_forbidden,
} from "./style";

const Toggle = (props: {
  InputAttr?: ComponentAttr;
  ToggleAttr?: ComponentAttr;
  ToggleName?: string;
  a2fMode?: boolean;
  isEdit?: boolean;
  is2FA: boolean;
}) => {
  let { InputAttr, ToggleAttr, ToggleName, a2fMode, isEdit, is2FA } = props;

  const default_inputattr = {
    type: "checkbox",
    class: input_default,
    name: ToggleName || "toggle_default",
    ...(a2fMode && is2FA ? { checked: is2FA } : {}),
    ...(!isEdit ? { disabled: true } : {}),
  };

  const default_toggleattr = {
    class: toggle_default + (!isEdit ? toggle_forbidden : toggle_allowed),
    ...(!isEdit ? { disabled: true } : {}),
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

export default Toggle;
