import Form from "../Form";
import Input from "#components/Inputs/Input.ts";
import Submit from "#components/Inputs/Submit.ts";
import { handle2FA } from "#requests/authRequest.ts";
import { form_default } from "../style";

const Form2FA = (props: {
	setter: (toSet: {}) => void;
	setterAuth: (toSet: boolean) => void;
	setter2FA: (toSet: boolean) => void;
}) => {
	const { setter, setterAuth, setter2FA } = props;

	return Form(
		{ attr: { class: form_default, id: "form_2FA" } },
		Input({ attr: { type: "text", name: "code", placeholder: "code 2FA" } }),
		Submit({
			text: "Envoyer",
			attr: {
				onClick: () => {
					handle2FA(setter);
					setter2FA(false);
					setterAuth(false);
				},
			},
		})
	);
};

export default Form2FA;
