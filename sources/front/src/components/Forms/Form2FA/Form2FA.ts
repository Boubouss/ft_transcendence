import Form from "../Form";
import Input from "#components/Inputs/Input.ts";
import Submit from "#components/Inputs/Submit/Submit.ts";
import { handle2FA } from "#requests/authRequest.ts";
import { form_A2F } from "../style";
import type { User, UserForm } from "#types/user.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import { createElement } from "#core/render.ts";

const Form2FA = (props: {
  setterUser: (toSet: User | null) => void;
  setterAuth: (toSet: boolean) => void;
  setter2FA: (toSet: boolean) => void;
  setError: (toSet: string) => void;
  setShowModalError: (toSet: boolean) => void;
  tempUser: UserForm | null;
}) => {
  const {
    setterUser,
    setterAuth,
    setter2FA,
    setError,
    setShowModalError,
    tempUser,
  } = props;
  return Form(
    { attr: { class: form_A2F, id: "form_2FA" } },
    createElement(
      "div",
      { class: "" },
      useLanguage("sentto") + tempUser?.email
    ),
    Input({
      attr: {
        type: "text",
        name: "code",
        maxlength: "6",
        minlength: "6",
        inputmode: "numeric",
        pattern: "[0-9]{6}",
        placeholder: useLanguage("entera2f"),
      },
    }),
    Submit({
      text: "Envoyer",
      attr: {
        onClick: () => {
          handle2FA(
            setterUser,
            setter2FA,
            setError,
            setShowModalError,
            tempUser
          );
          setterAuth(false);
        },
      },
    })
  );
};

export default Form2FA;
