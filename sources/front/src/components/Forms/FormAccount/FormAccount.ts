import Input from "#components/Inputs/Input.ts";
import Submit from "#components/Inputs/Submit/Submit.ts";
import Toggle from "#components/Inputs/Toggle/Toggle.ts";
import { useState } from "#core/framework.ts";
import { createElement } from "#core/render.ts";
import { useForm } from "#hooks/useForm.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import { handleEditUser } from "#requests/userRequest.ts";
import { Form_ID } from "#types/enums.ts";
import { useAvatar } from "#hooks/useAvatar.ts";
import _ from "lodash";
import Form from "../Form";
import {
  a2f_container,
  a2f_title,
  avatar_class,
  avatar_container_class,
  avatar_img_class,
  edit_btn,
  edit_container,
  eyes_container,
  eyes_img,
  form_account,
  form_part_inputs,
  input_account,
  submit_account_default,
} from "./style";
import { useContext } from "#core/hooks/useContext.ts";
import type { UserState } from "#pages/Multiplayer/Multiplayer.ts";

const FormAccount = (
  setShowMoral: (toSet: boolean) => void,
  setError: (toSet: string) => void
) => {
  const [isEditing, setEditing] = useState(false);
  const [isView, setIsView] = useState(false);
  const [currentPassword, setcurrentPassword] = useState("");

  const [getContext, _set] = useContext();
  const [user, _setUser] = getContext("user") as UserState;

  return Form(
    {
      attr: {
        id: "form-account",
        class: form_account,
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
            placeholder: user?.email,
            value: user?.email,
            class: input_account,
            readonly: true,
          },
        }),
        Input({
          attr: {
            type: "text",
            name: "name",
            value: isEditing ? "" : user?.name,
            placeholder: isEditing ? user?.name : useLanguage("name"),
            class: input_account,
            minlength: "3",
            maxlength: "20",
            ...(!isEditing ? { readonly: true } : {}),
          },
        }),
        Input(
          {
            attr: {
              type: isView ? "text" : "password",
              name: "password",
              placeholder: useLanguage("pw"),
              pattern:
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$",
              minlength: "8",
              value: isEditing ? currentPassword : "            ",
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
              src: isView ? "/icons/eye_opened.png" : "/icons/eye_closed.png",
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
            is2FA: user?.configuration.is2FA ?? false,
          })
        )
      ),
      createElement(
        "div",
        { class: avatar_container_class },
        Input({
          attr: {
            name: "avatar",
            type: "file",
            class: avatar_class,
            ...(!isEditing ? { disabled: true } : {}),
          },
        }),
        createElement("img", {
          src: useAvatar(user?.avatar, user?.updated_at),
          class: avatar_img_class,
        })
      )
    ),
    createElement(
      "div",
      { class: edit_container },
      Submit({
        text: useLanguage("editinfo"),
        attr: {
          class: edit_btn(isEditing),
          onClick: () => {
            setEditing(!isEditing);
          },
        },
      }),

      Submit({
        text: useLanguage("valid"),
        attr: {
          class: submit_account_default(isEditing),
          onClick: () => {
            if (isEditing) {
              setIsView(false);
              handleEditUser(setEditing, setShowMoral, setError);
            }
          },
          ...(!isEditing ? { disabled: true } : {}),
        },
      })
    )
  );
};

export default FormAccount;
