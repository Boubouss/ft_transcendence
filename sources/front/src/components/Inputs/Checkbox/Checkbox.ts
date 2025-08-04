import { useRef, type Component, type ComponentAttr } from "#core/framework";
import Input from "../Input";
import _ from "lodash";

type Props = {
  externalValueRef?: { current: string };
  attr?: ComponentAttr;
  labelAttr?: ComponentAttr;
};

const Checkbox = (
  { externalValueRef, attr, labelAttr }: Props,
  ...childrens: Component[]
) => {
  let valueRef = externalValueRef;
  if (_.isUndefined(valueRef)) valueRef = useRef("false");

  const defaultAttr = {
    checked: valueRef.current === "true",
    onInput: (e: InputEvent) => handleInput(e),
  };

  attr = {
    ...defaultAttr,
    ...attr,
  };

  const handleInput = (event: InputEvent) => {
    const target = event.target as HTMLInputElement;
    if (!target) return;

    valueRef.current = target.checked.toString();
  };

  return Input({ externalValueRef: valueRef, attr, labelAttr }, ...childrens);
};

export default Checkbox;
