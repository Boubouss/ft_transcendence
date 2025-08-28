import Form from "../Form";
import Input from "#components/Inputs/Input.ts";
import Submit from "#components/Inputs/Submit/Submit.ts";
import { handle2FA } from "#requests/authRequest.ts";
import { form_A2F } from "../style";
import { useLanguage } from "#hooks/useLanguage.ts";
import { createElement } from "#core/render.ts";
import { useContext } from "#core/hooks/useContext.ts";
import type { UserState } from "#pages/Multiplayer/Multiplayer.ts";

const Form2FA = (props: {
  setterAuth: (toSet: boolean) => void;
  setter2FA: (toSet: boolean) => void;
  setError: (toSet: string) => void;
  setShowModalError: (toSet: boolean) => void;
}) => {
  const {
    setterAuth,
    setter2FA,
    setError,
    setShowModalError,
  } = props;

  const [getContext, _set] = useContext();
  const [user, _setUser] = getContext("user") as UserState;

  return Form(
    { attr: { class: form_A2F, id: "form_2FA" } },
    createElement(
      "div",
      { class: "" },
      useLanguage("sentto") + user?.email
    ),
    Input({
      attr: {
        type: "text",
        name: "code",
        maxlength: "6",
        minlength: "6",
        inputmode: "numeric",
        pattern: "[0-9]{6}",
        placeholder: useLanguage("entercode"),
      },
    }),
    Submit({
      text: "Envoyer",
      attr: {
        onClick: () => {
          handle2FA(
            setter2FA,
            setError,
            setShowModalError,
          );
          setterAuth(false);
        },
      },
    })
  );
};

export default Form2FA;
