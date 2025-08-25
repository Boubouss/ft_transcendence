import {
  createElement,
  navigateTo,
  type ComponentAttr,
} from "#core/framework.ts";
import Button from "#components/Buttons/Button.ts";
import List from "#components/Lists/List.ts";
import Dropdown from "../Dropdown";
import { handleDeconnexion } from "#requests/authRequest.ts";
import { btn_list, btn_user } from "#components/Buttons/style.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import {
  dropdown_content,
  dropdown_default,
  dropdown_user_img,
} from "../style";
import { getStorage } from "#services/data.ts";
import { useAvatar } from "#hooks/useAvatar.ts";
import { KeysStorage } from "#types/enums.ts";
import { useContext } from "#core/hooks/useContext.ts";

const DropdownUser = (props: {
  attr?: ComponentAttr;
  attrContent?: ComponentAttr;
}) => {
  const [getContext, _set] = useContext();
  const user = getContext("user");
  const setUser = getContext("setUser");

  let { attr, attrContent } = props;

  const default_attr = { class: dropdown_default + " w-[220px]" };
  const default_attr_content = { class: dropdown_content + " w-[220px]" };

  attr = { ...default_attr, ...attr };
  attrContent = { ...default_attr_content, ...attrContent };

  return Dropdown(
    {
      btn: {
        children: createElement(
          "span",
          { class: btn_user },
          createElement("img", {
            src: useAvatar(user?.avatar),
            class: dropdown_user_img,
          }),
          `${getStorage(sessionStorage, KeysStorage.USERTRANS)?.name}`
        ),
      },
      attr,
    },
    Button,
    List({ attr: attrContent }, Button, [
      {
        children: useLanguage("myacc"),
        attr: {
          class: btn_list + " rounded-t-[20px]",
          onClick: () => navigateTo("/account"),
        },
      },
      {
        children: useLanguage("career"),
        attr: {
          class: btn_list,
          onClick: () => navigateTo("/stats"),
        },
      },
      {
        children: useLanguage("logout"),
        attr: {
          class: btn_list + " rounded-b-[20px]",
          onClick: () => {
            // navigateTo("/");
            handleDeconnexion(setUser);
          },
        },
      },
    ])
  );
};

export default DropdownUser;
