import { useState, type ComponentAttr } from "#src/core/framework.ts";
import { createElement } from "#src/core/render.ts";
import { getStorage } from "#src/services/data.ts";
import Input from "../Input";
import "./style.css";

import { input_default, label_default, back_default } from "./style";
import { KeysStorage } from "#src/types/user.ts";

const Toggle = (props: {
  labelAttr?: ComponentAttr;
  InputAttr?: ComponentAttr;
  BackAttr?: ComponentAttr;
}) => {
  const user = getStorage(sessionStorage, KeysStorage.USERTRANS);

  let { labelAttr, InputAttr, BackAttr } = props;

  const handleA2F = () => {};

  const default_label_attr = { class: label_default };
  const default_inputattr = {
    type: "checkbox",
    onClick: () => handleA2F(),
    class: input_default,
  };
  const default_fdivattr = { class: back_default };



  labelAttr = { ...default_label_attr, ...labelAttr };
  InputAttr = { ...default_inputattr, ...InputAttr };
  BackAttr = { ...default_fdivattr, ...BackAttr };

  return createElement(
    "label",
    labelAttr,
    Input({ attr: InputAttr }),
    createElement("div", BackAttr)
  );
};

export default Toggle;
