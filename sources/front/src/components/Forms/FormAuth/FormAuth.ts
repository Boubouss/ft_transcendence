import Input from "#src/components/Inputs/Input.ts";
import Submit from "#src/components/Inputs/Submit.ts";
import { useState } from "#src/core/hooks/useState.ts";
import { createElement } from "#src/core/render.ts";
import {
	handleConnexion,
	handleGoogleSign,
	handleRegister,
} from "#src/requests/authRequest.ts";
import Form from "../Form";
import {
	form_choice,
	form_choice_active,
	form_choice_container,
	form_connexion,
} from "../style";

const FormAuth = () => {
	const [isConnexion, setIsConnexion] = useState(false);

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
				"Sign In"
			),
			createElement(
				"div",
				{
					class: isConnexion ? form_choice : form_choice_active,
					onClick: () => setIsConnexion(false),
				},
				"Sign Up"
			),
			createElement(
				"div",
				{ class: form_choice, onClick: () => handleGoogleSign() },
				"Google"
			)
		),
		isConnexion
			? createElement("div", { class: `hidden` })
			: Input({ attr: { type: "email", name: "email", placeholder: "email" } }),
		Input({ attr: { type: "text", name: "name", placeholder: "name" } }),
		Input({
			attr: { type: "password", name: "password", placeholder: "password" },
		}),
		isConnexion
			? Submit({
					text: "Connexion",
					attr: { onClick: () => handleConnexion() },
			  })
			: Submit({
					text: "Inscription",
					attr: { onClick: () => handleRegister() },
			  })
	);
};

export default FormAuth;
