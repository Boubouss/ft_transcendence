import {
  createElement,
  useEffect,
  useState,
  type Component,
  type ComponentAttr,
} from "#core/framework.ts";
import { dropdown_btn, dropdown_default } from "./style";

const Dropdown = (
  props: {
    btn: {
      children: string | Component;
      attr?: ComponentAttr;
    };
    attr?: ComponentAttr;
  },
  button: (props: {
    children: string | Component;
    attr?: ComponentAttr;
  }) => Component,
  content: Component
) => {
  const [dropdown, setDropdown] = useState(false, true);

  let { btn, attr } = props;
  let { children, attr: attrButton } = btn;

  const default_attr = { class: dropdown_default };
  const default_attr_button = {
    class: dropdown_btn,
    onClick: () => setDropdown(!dropdown),
  };

  attr = { ...default_attr, ...attr };
  attrButton = { ...default_attr_button, ...attrButton };

  return createElement(
    "div",
    attr,
    button({ children, attr: attrButton }),
    dropdown ? content : createElement("div", { class: `hidden` })
  );
};

export default Dropdown;
