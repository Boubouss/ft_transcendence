import Form from "../Form";
import Input from "#components/Inputs/Input.ts";
import Submit from "#components/Inputs/Submit/Submit.ts";
import { useState } from "#core/hooks/useState.ts";
import { createElement } from "#core/render.ts";
import type { User, UserForm } from "#types/user.ts";

import {
  handleConnexion,
  handleGoogleSign,
  handleRegister,
} from "#requests/authRequest.ts";

import {
  form_choice,
  form_choice_active,
  form_choice_container,
  form_connexion,
  img_google,
} from "../style";
import { useLanguage } from "#hooks/useLanguage.ts";
import _ from "lodash";
import {
  input_default,
  label_default,
} from "#components/Inputs/style.ts";

const FormAuth = (props: {
  setModal: (toSet: boolean) => void;
  set2FA: (toSet: boolean) => void;
  setError: (toSet: string) => void;
  setShowModalError: (toSet: boolean) => void;
  setUser: (toSet: User | null) => void;
  setTempUser: (toSet: UserForm | null) => void;
}) => {
  const [isConnexion, setIsConnexion] = useState(false);

  const {
    setModal,
    set2FA,
    setUser,
    setError,
    setShowModalError,
    setTempUser,
  } = props;

  return Form(
    { attr: { class: form_connexion, id: "form_auth" } },
    createElement(
      "div",
      { class: form_choice_container },
      createElement(
        "div",
        {
          class: isConnexion ? form_choice_active : form_choice,
          onClick: () => setIsConnexion(true),
        },
        useLanguage("loginin")
      ),
      createElement(
        "div",
        {
          class: isConnexion ? form_choice : form_choice_active,
          onClick: () => setIsConnexion(false),
        },
        useLanguage("signin")
      ),
      createElement(
        "div",
        { class: form_choice, onClick: () => handleGoogleSign() },
        createElement("img", {
          class: img_google,
          src: "/icons/google_icon.png",
        }),
        "Google"
      )
    ),
    Input({
      attr: {
        type: "email",
        name: "email",
        placeholder: "Email",
        class: input_default + (isConnexion && " hidden"),
      },
      labelAttr: { class: label_default + (isConnexion && " hidden") },
    }),
    Input({
      attr: {
        type: "text",
        name: "name",
        placeholder: useLanguage("name"),
      },
    }),
    Input({
      attr: {
        type: "password",
        name: "password",
        placeholder: useLanguage("pw"),
      },
    }),
    isConnexion
      ? Submit({
          text: "Connexion",
          attr: {
            onClick: () => {
              handleConnexion(
                set2FA,
                setUser,
                setError,
                setShowModalError,
                setTempUser
              );
              setModal(false);
            },
          },
        })
      : Submit({
          text: useLanguage("valid"),
          attr: {
            onClick: () => {
              handleRegister(
                set2FA,
                setError,
                setTempUser,
                setShowModalError,
                setModal
              );
            },
          },
        })
  );
};

export default FormAuth;
