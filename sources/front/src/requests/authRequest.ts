import {
	API_USER_ROUTES,
	fetchAPI,
	getStorage,
	removeStorage,
	setStorage,
	useForm,
} from "#services/data.ts";

export const handleConnexion = async (
	set2FA: (toSet: boolean) => void,
	setUser: (toSet: {} | null) => void
) => {
	const form = useForm("form_auth");
	const data = {
		name: form?.get("name"),
		password: form?.get("password"),
	};
	const user = await fetchAPI(
		import.meta.env.VITE_API_USER + API_USER_ROUTES.LOGIN,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		}
	);

	if (user) {
		const { token, ...userData } = user;

		setStorage(sessionStorage, "transcendence_user", userData);

		if (token) {
			setStorage(localStorage, "transcendence_conf", {
				id: user.id,
				token: user.token,
			});
			setUser(getStorage(sessionStorage, "transcendence_user"));
		} else {
			setStorage(localStorage, "transcendence_conf", {
				id: user.id,
			});
			set2FA(true);
		}
	}
};

export const handleRegister = async (setter: (toSet: boolean) => void) => {
	const form = useForm("form_auth");
	const data = {
		email: form?.get("email"),
		name: form?.get("name"),
		password: form?.get("password"),
	};
	const user = await fetchAPI(
		import.meta.env.VITE_API_USER + API_USER_ROUTES.REGISTER,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		}
	);

	if (user) {
		setStorage(localStorage, "transcendence_conf", {
			id: user.id,
		});
		setStorage(sessionStorage, "transcendence_user", user);
		setter(true);
	}
};

export const handle2FA = async (setter: (toSet: boolean) => void) => {
	const user = getStorage(sessionStorage, "transcendence_user");
	const form = useForm("form_2FA");
	const data = {
		code: form?.get("code"),
		name: user.name,
		type: "REGISTER",
	};
	const token = await fetchAPI(
		import.meta.env.VITE_API_USER + API_USER_ROUTES.AUTH_2FA,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		}
	);

	if (token) {
		setStorage(localStorage, "transcendence_conf", { id: user.id, ...token });
		setter(getStorage(sessionStorage, "transcendence_user"));
	}
};

export const handleGoogleSign = async () => {
	const google = await fetchAPI(
		import.meta.env.VITE_API_USER + API_USER_ROUTES.GOOGLE,
		{
			method: "GET",
		}
	);

	window.location.href = google.url;
};

export const handleAutoConnect = async (setter: (toSet: boolean) => void) => {
	const configuration: {
		id: string;
		token: string;
		lang?: string;
	} = getStorage(localStorage, "transcendence_conf");
	if (
		configuration?.token &&
		!getStorage(sessionStorage, "transcendence_user")
	) {
		const user = await fetchAPI(
			import.meta.env.VITE_API_USER +
				API_USER_ROUTES.CRUD_USER +
				`/${configuration.id}`,
			{
				method: "GET",
				headers: { Authorization: `Bearer ` + configuration.token },
			}
		);
		if (user) setStorage(sessionStorage, "transcendence_user", user);
		else
			setStorage(localStorage, "transcendence_conf", {
				lang: configuration?.lang ?? "FR",
			});
	}

	if (
		configuration?.token &&
		getStorage(sessionStorage, "transcendence_user")
	) {
		setter(getStorage(sessionStorage, "transcendence_user"));
	}
};

export const handleDeconnexion = (setter: (toSet: {} | null) => void) => {
	const configuration = getStorage(localStorage, "transcendence_conf");
	setStorage(localStorage, "transcendence_conf", { lang: configuration.lang });
	removeStorage(sessionStorage, "transcendence_user");
	setter(null);
};
