import { useEffect, useState, type ComponentAttr } from "#core/framework.ts";
import { createElement } from "#core/render.ts";
import { getStorage } from "#services/data.ts";
import Input from "../Input";

import {
  input_default,
  span_off,
  span_on,
  toggle_allowed,
  toggle_default,
  toggle_forbidden,
} from "./style";
import { KeysStorage } from "#types/enums.ts";

const Toggle = (props: {
  InputAttr?: ComponentAttr;
  ToggleAttr?: ComponentAttr;
  ToggleName?: string;
  a2fMode?: boolean;
  isEdit?: boolean;
}) => {
  const user = getStorage(sessionStorage, KeysStorage.USERTRANS);
  let is2fa = user.configuration.is2FA;
  //let is2fa = user.configuration.is2FA;

  let { InputAttr, ToggleAttr, ToggleName, a2fMode, isEdit } = props;

  const default_inputattr = {
    type: "checkbox",
    class: input_default,
    name: ToggleName || "toggle_default",
    ...(a2fMode && is2fa ? { checked: true } : {}),
    ...(!isEdit ? { disabled: true } : {}),
  };

  const default_toggleattr = {
    class: toggle_default + (!isEdit ? toggle_forbidden : toggle_allowed),
    ...(!isEdit ? { disabled: true } : {}),
  };
    (ToggleAttr = { ...default_toggleattr, ...ToggleAttr });
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
