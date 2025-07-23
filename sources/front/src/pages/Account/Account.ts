import Form from "#src/components/Forms/Form.ts";
import { createElement } from "#src/core/render.ts";
import Input from "#src/components/Inputs/Input.ts";
import {
  account_background,
  account_container,
  avatar,
  avatar_button_change,
  avatar_container,
  avatarxpwd_account,
  button_close,
  form_account,
  form_container,
  image_button_close,
  input_account,
  title_container,
  title_page_account,
} from "./style";
import Button from "#src/components/Buttons/Button.ts";
import { useLanguage } from "#src/services/language.ts";
import { navigateTo, useState } from "#src/core/framework.ts";
import Toggle from "#src/components/Inputs/Toggle/Toggle.ts";
import { getStorage } from "#src/services/data.ts";
import { KeysStorage } from "#src/types/user.ts";

const Account = () => {
  const [isEditing, setEditing] = useState(false);

  const handleClose = () => {
    navigateTo("/");
  };

  const handleChangeAvatar = () => {
    alert("change avatar");
  };

  return createElement(
    "div",
    { id: "account_background", class: account_background },
    createElement(
      "div",
      { id: "account_container", class: account_container },
      createElement(
        "div",
        { class: title_container },
        createElement(
          "h2",
          { name: "account_title", class: title_page_account },
          "Votre Compte"
        ),
        createElement(
          "button",
          { class: button_close, onClick: handleClose },
          createElement("img", {
            class: image_button_close,
            src: " ../../../../public/icons/close_icon.png",
          })
        )
      ),
      createElement(
        "div",
        { class: form_container },
        Form(
          {
            attr: {
              id: "form-account",
              class: form_account,
            },
          },

          Input({
            attr: {
              type: "email",
              name: "email",
              placeholder: "Email",
              class: input_account,
              ...(!isEditing ? { readonly: true } : {}),
            },
          }),
          Input({
            attr: {
              type: "text",
              name: "name",
              placeholder: useLanguage("username"),
              class: input_account,
              ...(!isEditing ? { readonly: true } : {}),
            },
          }),
          Input({
            attr: {
              type: "password",
              name: "password",
              placeholder: useLanguage("pw"),
              class: input_account,
              ...(!isEditing ? { readonly: true } : {}),
            },
          }),
          Toggle({})
        ),
        createElement(
          "div",
          { class: avatar_container },
          createElement("img", {
            src:
              getStorage(sessionStorage, KeysStorage.USERTRANS).avatar ||
              "../../../../public/images/avatar_1.jpg",
            class: avatar,
          }),
          Button({
            children: useLanguage("avatar"),
            attr: {
              class: avatar_button_change,
              onClick: handleChangeAvatar,
            },
          })
        )
      )
      
    )
  );
};

export default Account;
