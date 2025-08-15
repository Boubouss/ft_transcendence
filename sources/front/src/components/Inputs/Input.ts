import { input_default, label_default } from "./style";
import { useRef } from "#core/hooks/useRef.ts";
import _ from "lodash";

import {
  createElement,
  type Component,
  type ComponentAttr,
} from "#core/framework";

const Input = (
  props: {
    attr: ComponentAttr;
    labelAttr?: ComponentAttr;
    labelContent?: string;
  },
  ...childrens: Component[]
) => {
  let { attr, labelAttr, labelContent } = props;

  const ref = useRef<HTMLInputElement | null>(null);

  const default_attr = {
    ref,
    value: !_.isEmpty(ref.current) ? ref.current.value : "",
    class: input_default,
  };
  const default_label_attr = { class: label_default };

  attr = { ...default_attr, ...attr };
  labelAttr = { ...default_label_attr, ...labelAttr };

  return createElement(
    "label",
    labelAttr,
    !_.isEmpty(labelContent) && labelContent,
    createElement("input", attr),
    ...childrens
  );
};

export default Input;
