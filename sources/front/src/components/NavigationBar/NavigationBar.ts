import { dropdown_default } from "#components/Dropdowns/style.ts";
import Friends from "#components/Friends/Friends.ts";
import { createElement, type ComponentAttr } from "#core/framework.ts";
import { getStorage } from "#services/data.ts";
import { KeysStorage } from "#types/enums.ts";
import { useLanguage } from "../../hooks/useLanguage";
import Button from "../Buttons/Button";
import { btn_modal } from "../Buttons/style";
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
    DropdownLang({}),
    createElement(
      "div",
      {
        class: getStorage(sessionStorage, KeysStorage.USERTRANS)
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
        class: !getStorage(sessionStorage, KeysStorage.USERTRANS)
          ? btn_modal
          : "hidden",
        onClick: () => setModalAuth(!modalAuth),
      },
    })
  );
};

export default NavigationBar;
