import { dropdown_default } from "#components/Dropdowns/style.ts";
import Friends from "#components/Friends/Friends.ts";
import {
  createElement,
  navigateTo,
  type ComponentAttr,
} from "#core/framework.ts";
import { getStorage } from "#services/data.ts";
import { KeysStorage } from "#types/enums.ts";
import { useLanguage } from "../../hooks/useLanguage";
import Button from "../Buttons/Button";
import { btn_default, btn_modal } from "../Buttons/style";
import DropdownUser from "../Dropdowns/DorpdownUser/DropdownUser";
import DropdownLang from "../Dropdowns/DropdownLang/DropdownLang";
import FriendsBar from "./FriendsBar/FriendsBar";
import { navbar_default } from "./style";

const NavigationBar = (props: {
  modalState?: { modalAuth: boolean; setModalAuth: (toSet: boolean) => void };
  attr?: ComponentAttr;
}) => {
  let { modalState, attr } = props;
  const { modalAuth, setModalAuth } = modalState ?? {
    modalAuth: false,
    setModalAuth: (toSet: boolean) => {
      return toSet;
    },
  };

  const default_attr = { class: navbar_default };

  attr = { ...default_attr, ...attr };

  return createElement(
    "div",
    attr,
    createElement(
      "div",
      { class: "flex gap-10" },
      Button({
        children: createElement("img", {
          src: "/icons/home_icon.png",
          class: "h-[50px] cursor-pointer invert",
        }),
        attr: {
          class: btn_default,
          onClick: () => navigateTo("/"),
        },
      }),
      DropdownLang({})
    ),
    createElement(
      "div",
      {
        class: getStorage(sessionStorage, KeysStorage.USERTRANS) && getStorage(localStorage, KeysStorage.CONFTRANS).token
          ? "flex gap-10"
          : "hidden",
      },
      Friends(FriendsBar),
      DropdownUser({
        attr: {
          class: dropdown_default + " w-[220px]",
        },
      })
    ),

    Button({
      children: useLanguage("signin") + " / " + useLanguage("loginin"),
      attr: {
        class:
          !getStorage(sessionStorage, KeysStorage.USERTRANS) &&
          !(window.location.pathname === "/local")
            ? btn_modal
            : "hidden",
        onClick: () => {
          setModalAuth(!modalAuth);
        },
      },
    })
  );
};

export default NavigationBar;
