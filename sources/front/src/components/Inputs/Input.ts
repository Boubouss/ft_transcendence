import { input_default, label_default } from "./style";
import { useRef } from "#core/hooks/useRef.ts";
import _ from "lodash";

import {
  createElement,
  type Component,
  type ComponentAttr,
} from "#core/framework";

type Props = {
  externalValueRef?: { current: string };
  attr: ComponentAttr;
  labelAttr?: ComponentAttr;
  labelContent?: string;
};

const Input = (
  { externalValueRef, attr, labelAttr, labelContent }: Props,
  ...childrens: Component[]
) => {
  let valueRef = externalValueRef;
  if (_.isUndefined(valueRef)) valueRef = useRef("");

  const defaultLabelAttr = { class: label_default };
  const defaultAttr = {
    value: !_.isEmpty(valueRef.current) ? valueRef.current : "",
    onInput: (e: InputEvent) => handleInput(e),
    class: input_default,
  };

  attr = { ...defaultAttr, ...attr };
  labelAttr = { ...defaultLabelAttr, ...labelAttr };

  const handleInput = (event: InputEvent) => {
    const target = event.target as HTMLInputElement;
    if (!target) return;

    valueRef.current = target.value;
  };

  return createElement(
    "label",
    labelAttr,
    !_.isEmpty(labelContent) && labelContent,
    createElement("input", attr),
    ...childrens
  );
};

export default Input;
