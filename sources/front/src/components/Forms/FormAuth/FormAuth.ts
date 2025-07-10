import Input from "#src/components/Inputs/Input.ts";
import Submit from "#src/components/Inputs/Submit.ts";
import { useState } from "#src/core/hooks/useState.ts";
import { createElement } from "#src/core/render.ts";
import {
	fetchAPI,
	getStorage,
	setStorage,
	useForm,
} from "#src/services/data.ts";
import Form from "../Form";
import {
	form_choice,
	form_choice_active,
	form_choice_container,
	form_connexion,
} from "../style";

const FormAuth = () => {
	const [isConnexion, setIsConnexion] = useState(false);

	const handleConnexion = async () => {
		console.log("API Connexion");
		const form = useForm("form_auth");
		const user = await fetchAPI("https://localhost:3000/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: form,
		});

		if (user) {
			setStorage(localStorage, "transcendence_token", {
				id: user.id,
				token: user.token,
			});
			setStorage(sessionStorage, "transcendence_user", user);
		}
	};

	const handleRegister = async () => {
		console.log("API Inscription");
		const form = useForm("form_auth");
		const data = {
			email: form?.get("email"),
			name: form?.get("name"),
			password: form?.get("password"),
		};
		const user = await fetchAPI("https://localhost:3000/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		if (user) {
			setStorage(localStorage, "transcendence_token", {
				id: user.id,
				token: user.token,
			});
			setStorage(sessionStorage, "transcendence_user", user);
		}
	};

	function handleGoogleSign() {
		console.log("API Google Sign In");
	}

	return Form(
		{ class: form_connexion, id: "form_auth" },
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
			: Input("email", "email"),
		Input("text", "name"),
		Input("password", "password"),
		isConnexion
			? Submit("Connexion", { onClick: () => handleConnexion() })
			: Submit("Inscription", { onClick: () => handleRegister() })
	);
};

export default FormAuth;
