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
  form_account,
  form_container,
  image_button_close,
  input_account,
  submit_account_default,
  title_container,
  title_page_account,
  edit_container,
  a2f_container,
  a2f_title,
  edit_btn,
  eyes_container,
  eyes_img,
  edit_btn_enable,
  account_page,
} from "./style";
import Button from "#components/Buttons/Button.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import { navigateTo, useEffect, useState } from "#core/framework.ts";
import Toggle from "#components/Inputs/Toggle/Toggle.ts";
import { getStorage } from "#services/data.ts";
import { Form_ID, KeysStorage } from "#types/enums.ts";
import { useForm } from "#hooks/useForm.ts";
import _ from "lodash";
import { handleEditUser } from "#requests/userRequest.ts";
import type { User, UserEditForm } from "#types/user.ts";
import NavigationBar from "#components/NavigationBar/NavigationBar.ts";

const Account = () => {
  const user = getStorage(sessionStorage, KeysStorage.USERTRANS);

  const [isEditing, setEditing] = useState(false);
  const [isA2F, setA2F] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isUser, setUserState] = useState(user);
  const [currentPassword, setcurrentPassword] = useState("");

  const handleChangeAvatar = () => {
    console.log("change avatar");
  };

  useEffect(() => {
    setA2F(user.configuration.is2FA);
  }, []);

  const handleSubmit = async () => {
    const form = useForm("form-account");
    const newname = form?.get("name")?.toString().trim();
    const newemail = form?.get("email")?.toString().trim();
    const newpsw = form?.get("password")?.toString().trim();
    console.log(form);

    const edituser: UserEditForm = {
      id: user.id,
      configuration: _.cloneDeep(user.configuration),
    };

    const compuser = _.cloneDeep(edituser);

    if (!_.isEmpty(newname)) edituser.name = newname;
    if (!_.isEmpty(newemail)) {
      edituser.email = newemail;
    }
    if (!_.isEmpty(newpsw)) edituser.password = newpsw;

    const a2fisnull_inform = _.isNull(form?.get(Form_ID.A2F));
    const a2f = user.configuration.is2FA;

    if (a2fisnull_inform && a2f === true) {
      edituser.configuration.is2FA = false;
      setA2F(false);
    } else if (!a2fisnull_inform && a2f === false) {
      edituser.configuration.is2FA = true;
      setA2F(true);
    }

    if (JSON.stringify(edituser) === JSON.stringify(compuser)) return;

    handleEditUser(edituser);
  };

  return createElement(
    "div",
    { id: "account_background", class: account_background },
    NavigationBar({ userState: { user: isUser, setUser: setUserState } }),
    createElement(
      "div",
      { class: account_page },
      createElement(
        "div",
        { id: "account_container", class: account_container },
        createElement(
          "div",
          { class: title_container },
          createElement(
            "h2",
            { name: "account_title", class: title_page_account },
            useLanguage("myacc")
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
                  value: isEditing ? currentPassword : "**********",
                  class: input_account,
                  ...(!isEditing ? { readonly: true } : {}),
                },
              },
              createElement(
                "div",
                {
                  ...(!isEditing ? { disabled: true } : {}),

                  class: eyes_container,
                  onClick: () => {
                    if (isEditing) {
                      const form = useForm("form-account");
                      const pw = form?.get("password")?.toString();

                      if (pw) setcurrentPassword(pw);
                      setIsView(!isView);
                    }
                  },
                },
                createElement("img", {
                  class: eyes_img,
                  src: isView
                    ? "../../../public/icons/eye_opened.png"
                    : "../../../public/icons/eye_closed.png",
                })
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
                ToggleName: Form_ID.A2F,
                isEdit: isEditing,
                a2fMode: true,
                is2FA: isA2F,
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
        createElement(
          "div",
          { name: "edit_container", class: edit_container },
          Button({
            children: useLanguage("editinfo"),
            attr: {
              class: !isEditing ? edit_btn : edit_btn_enable,
              onClick: () => {
                setEditing(!isEditing);
              },
            },
          })
        ),
        Button({
          children: useLanguage("valid"),
          attr: {
            class: submit_account_default,
            onClick: () => {
              handleSubmit(), setEditing(!isEditing);
            },
            ...(!isEditing ? { disabled: true } : {}),
          },
        })
      )
    )
  );
};

export default Account;
