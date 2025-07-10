import { fetchAPI, setStorage, useForm } from "#src/services/data.ts";

export const handleConnexion = async () => {
	console.log("API Connexion");
	const form = useForm("form_auth");
	const user = await fetchAPI("https://localhost:3000/auth/login", {
		method: "POST",
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

export const handleRegister = async () => {
	console.log("API Inscription");
	const form = useForm("form_auth");
	const data = {
		email: form?.get("email"),
		name: form?.get("name"),
		password: form?.get("password"),
	};
	console.log(JSON.stringify(data));
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

export const handleGoogleSign = () => {
	console.log("API Google Sign In");
};
