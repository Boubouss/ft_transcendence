import { useState, type ComponentAttr } from "#src/core/framework.ts";
import { createElement } from "#src/core/render.ts";
import { getStorage } from "#src/services/data.ts";
import Input from "../Input";
import "./style.css";

import { input_default, label_default, back_default } from "./style";

const Toggle = (props: {
  labelAttr?: ComponentAttr;
  InputAttr?: ComponentAttr;
  BackAttr?: ComponentAttr;
}) => {
  const user = getStorage(sessionStorage, "transcendence_user");

  let { labelAttr, InputAttr, BackAttr } = props;

  const handleA2F = () => {};

  const default_label_attr = { class: label_default };
  const default_inputattr = {
    type: "checkbox",
    onClick: () => handleA2F(),
    class: input_default,
  };
  const default_fdivattr = { class: back_default };

  console.log(default_label_attr);
  console.log(default_inputattr);
  console.log(default_fdivattr);


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
