import Form from "../Form";
import Input from "#components/Inputs/Input.ts";
import Submit from "#components/Inputs/Submit/Submit.ts";
import { handle2FA } from "#requests/authRequest.ts";
import { form_default } from "../style";
import type { User } from "#types/user.ts";

const Form2FA = (props: {
  setterUser: (toSet: User | null) => void;
  setterAuth: (toSet: boolean) => void;
  setter2FA: (toSet: boolean) => void;
}) => {
  const { setterUser, setterAuth, setter2FA } = props;

  return Form(
    { attr: { class: form_default, id: "form_2FA" } },
    Input({ attr: { type: "text", name: "code", placeholder: "code 2FA" } }),
    Submit({
      text: "Envoyer",
      attr: {
        onClick: () => {
          handle2FA(setterUser);
          setter2FA(false);
          setterAuth(false);
        },
      },
    })
  );
};

export default Form2FA;
