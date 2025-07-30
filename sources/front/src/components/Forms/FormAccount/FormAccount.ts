import Button from "#components/Buttons/Button.ts";
import Input from "#components/Inputs/Input.ts";
import Submit from "#components/Inputs/Submit/Submit.ts";
import Toggle from "#components/Inputs/Toggle/Toggle.ts";
import { useEffect, useState } from "#core/framework.ts";
import { createElement } from "#core/render.ts";
import { useForm } from "#hooks/useForm.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import { handleEditAccount } from "#requests/userRequest.ts";
import { API_USER_ROUTES, getStorage } from "#services/data.ts";
import { Form_ID, KeysStorage } from "#types/enums.ts";
import Form from "../Form";
import {
  a2f_container,
  a2f_title,
  avatar,
  edit_btn,
  edit_btn_enable,
  edit_container,
  eyes_container,
  eyes_img,
  form_account,
  form_part_inputs,
  input_account,
  submit_account_default,
} from "./style";

const FormAccount = () => {
  const [isEditing, setEditing] = useState(false);

  const [isView, setIsView] = useState(false);
  const [isA2F, setA2F] = useState(false);
  const [currentPassword, setcurrentPassword] = useState("");
  const [Avatar, setAvatar] = useState("");
  const user = getStorage(sessionStorage, KeysStorage.USERTRANS);

  useEffect(() => {
    setA2F(user.configuration.is2FA);
  }, []);

  const bgUrl = `${
    import.meta.env.VITE_API_USER + API_USER_ROUTES.DOWNLOAD_AVATAR
  }/avatar_${user.id}.jpg`;
  const bgClass = `bg-[url('${bgUrl}')]`;

  return Form(
    {
      attr: {
        id: "form-account",
        class: form_account,
        ...(!isEditing ? { readonly: true } : {}),
      },
    },
    createElement(
      "div",
      { class: "flex", name: "form_block" },
      createElement(
        "div",
        { name: "form_part_inputs", class: form_part_inputs },
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
      Input({
        attr: {
          name: "avatar",
          type: "file",
          class: avatar + `${bgClass}`,
          style:
            "background-image: url('https://localhost:3000/download/avatar_1.jpg');",
          accept: ".jpeg",
          ...(!isEditing ? { disabled: true } : {}),
        },
      })
    ),
    createElement(
      "div",
      { class: edit_container },
      Button({
        children: useLanguage("editinfo"),
        attr: {
          class: !isEditing ? edit_btn : edit_btn_enable,
          onClick: () => {
            setEditing(!isEditing);
          },
        },
      }),

      Submit({
        text: useLanguage("valid"),
        attr: {
          class: submit_account_default,
          onClick: () => {
            handleEditAccount({ setA2F }), setEditing(!isEditing);
          },
          ...(!isEditing ? { disabled: true } : {}),
        },
      })
    )
  );
};

export default FormAccount;
