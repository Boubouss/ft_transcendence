import {
  createElement,
  type Component,
  type ComponentAttr,
} from "#core/framework";
import { modal_background, modal_default } from "./style";

const Modal = (
  props: {
    state: boolean;
    setter: (setState: boolean) => void;
    attr?: ComponentAttr;
    attrBackground?: ComponentAttr;
  },
  ...children: Component[]
) => {
  let { state, setter, attr, attrBackground } = props;

  const default_attr = { class: modal_default };
  const default_attr_bckg = {
    class: modal_background,
    onClick: () => setter(false),
  };

  attr = { ...default_attr, ...attr };
  attrBackground = { ...default_attr_bckg, ...attrBackground };

  return createElement(
    "div",
    !state ? {class : "hidden"} : null,
    createElement("div", attrBackground),
    createElement("div", attr, ...children)
  );
};

export default Modal;
