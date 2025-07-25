import Form from "#components/Forms/Form.ts";
import { createElement } from "#core/render.ts";
import Input from "#components/Inputs/Input.ts";
import {
  account_background,
  account_container,
  avatar,
  avatar_button_change,
  avatar_container,
  button_close,
  edittoggle_default,
  form_account,
  form_container,
  image_button_close,
  input_account,
  submit_account_default,
  title_container,
  title_page_account,
  edit_container,
  edit_message,
  a2f_container,
  a2f_title,
  edit_btn,
  eyes_container,
  eyes_img,
} from "./style";
import Button from "#components/Buttons/Button.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import { navigateTo, useState } from "#core/framework.ts";
import Toggle from "#components/Inputs/Toggle/Toggle.ts";
import { fetchAPI, getStorage } from "#services/data.ts";
import { KeysStorage } from "#types/enums.ts";
import { useForm } from "#hooks/useForm.ts";
import type { User } from "#types/user.ts";
import _ from "lodash";

const Account = () => {
  const [isEditing, setEditing] = useState(false);
  const [isView, setIsView] = useState(false);

  const user = getStorage(sessionStorage, KeysStorage.USERTRANS);

  const handleChangeAvatar = () => {
    console.log("change avatar");
  };

  const handleSubmit = () => {
    const form = useForm("form-account");
    const newname = form?.get("name")?.toString().trim();
    const newemail = form?.get("email")?.toString().trim();
    const newpsw = form?.get("password")?.toString().trim();

    const a2f = form?.get("toggle2fa");

    console.log(form);

    const edituser: User = {
      id: user.id,
      configuration: user.configuration,
    };

    if (!_.isEmpty(newname)) edituser.name = newname;
    if (!_.isEmpty(newemail)) {
      edituser.email = newemail;
    }
    if (!_.isEmpty(newpsw)) edituser.password = newpsw;

    console.log(edituser);

    setEditing(!isEditing);
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
          {
            class: button_close,
            onClick: () => {
              navigateTo("/");
            },
          },
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
              ...(!isEditing ? { readonly: true } : {}),
            },
          },

          Input({
            attr: {
              type: "email",
              name: "email",
              placeholder: isEditing ? user.email : "Email",
              value: isEditing ? "" : user.email,
              class: input_account,
              ...(!isEditing ? { readonly: true } : {}),
            },
          }),
          Input({
            attr: {
              type: "text",
              name: "name",
              value: isEditing ? "" : user.name,
              placeholder: isEditing ? user.name : useLanguage("username"),
              class: input_account,
              ...(!isEditing ? { readonly: true } : {}),
            },
          }),
          Input(
            {
              attr: {
                type: isView ? "text" : "password",
                name: "password",
                placeholder: useLanguage("pw"),
                value: isEditing ? "" : "**********",
                class: input_account,
                ...(!isEditing ? { readonly: true } : {}),
              },
            },
            createElement(
              "div",
              {
                class: eyes_container,
                onClick: () => {
                  console.log("test");
                },
              },
              createElement("img", { class: eyes_img })
            )
          ),
          createElement(
            "div",
            { name: "a2f_container", class: a2f_container },
            createElement(
              "h1",
              { name: "a2f_title", class: a2f_title },
              useLanguage("a2f")
            ),
            Toggle({
              ToggleName: "toggle2fa",
              isEdit: isEditing,
              a2fMode: true,
            })
          )
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
      ),
      //faire un bouton qui change de couleur, edit avec un state
      createElement(
        "div",
        { name: "edit_container", class: edit_container },
        //createElement(
        //  "h2",
        //  { class: edit_message, name: "edit_message" },
        //  useLanguage("editinfo")
        //),
        //Toggle({
        //  InputAttr: {
        //  },
        //  ToggleAttr: {
        //    class: edittoggle_default,
        //  },
        //})
        Button({
          children: useLanguage("editinfo"),
          attr: {
            class: edit_btn,
            onClick: () => {
              setEditing(!isEditing);
            },
          },
        })
      ),

      Button({
        children: "Submit",
        attr: {
          class: submit_account_default,
          onClick: handleSubmit,
          ...(!isEditing ? { disabled: true } : {}),
        },
      })
    )
  );
};

export default Account;
