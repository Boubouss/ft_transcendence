import { useEffect, useState, type ComponentAttr } from "#core/framework.ts";
import { createElement } from "#core/render.ts";
import { getStorage, setStorage } from "#services/data.ts";
import Input from "../Input";

import { input_default, span_off, span_on, toggle_default } from "./style";
import { KeysStorage } from "#types/enums.ts";

const Toggle = (props: { InputAttr?: ComponentAttr; ToggleName?: string }) => {
  const user = getStorage(sessionStorage, KeysStorage.USERTRANS);
  const isa2f = user.configuration.is2FA;

  let { InputAttr, ToggleName } = props;

  const default_inputattr = {
    type: "checkbox",
    class: input_default,
    name: ToggleName || "toggle_default",
  };

  InputAttr = { ...default_inputattr, ...InputAttr };

  return Input(
    { attr: InputAttr },
    createElement(
      "div",
      {
        class: (isa2f ? "checked" : "") + toggle_default,
      },
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
