import { navigateTo } from "#core/router.ts";
import { useForm } from "#hooks/useForm.ts";
import type { User } from "#types/user.ts";

import {
	API_USER_ROUTES,
	fetchAPI,
	getStorage,
	removeStorage,
	replaceStorage,
	setStorage,
} from "#services/data.ts";
import { KeysStorage } from "#types/enums.ts";

export const handleConnexion = async (
	set2FA: (toSet: boolean) => void,
	setUser: (toSet: User | null) => void
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

		setStorage(sessionStorage, KeysStorage.USERTRANS, userData);

		if (token) {
			setStorage(localStorage, KeysStorage.CONFTRANS, {
				id: user.id,
				token: user.token,
			});
			setUser(getStorage(sessionStorage, KeysStorage.USERTRANS));
		} else {
			setStorage(localStorage, KeysStorage.CONFTRANS, {
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
		setStorage(localStorage, KeysStorage.CONFTRANS, {
			id: user.id,
		});
		setStorage(sessionStorage, KeysStorage.USERTRANS, user);
		setter(true);
	}
};

export const handle2FA = async (setter: (toSet: User | null) => void) => {
	const user = getStorage(sessionStorage, KeysStorage.USERTRANS);
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
		setStorage(localStorage, KeysStorage.CONFTRANS, { id: user.id, ...token });
		setter(getStorage(sessionStorage, KeysStorage.USERTRANS));
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

export const handleAutoConnect = async (
	setter: (toSet: User | null) => void
) => {
	const configuration: {
		id: string;
		token: string;
		lang?: string;
	} = getStorage(localStorage, KeysStorage.CONFTRANS);
	if (
		configuration?.token &&
		!getStorage(sessionStorage, KeysStorage.USERTRANS)
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
		if (user) setStorage(sessionStorage, KeysStorage.USERTRANS, user);
		else
			setStorage(localStorage, KeysStorage.CONFTRANS, {
				lang: configuration?.lang ?? "FR",
			});
	}

	if (
		configuration?.token &&
		getStorage(sessionStorage, KeysStorage.USERTRANS)
	) {
		setter(getStorage(sessionStorage, KeysStorage.USERTRANS));
	}
};

export const handleDeconnexion = (setter: (toSet: User | null) => void) => {
	const configuration = getStorage(localStorage, KeysStorage.CONFTRANS);
	replaceStorage(localStorage, KeysStorage.CONFTRANS, {
		lang: configuration.lang,
	});
	removeStorage(sessionStorage, KeysStorage.USERTRANS);
	setter(null);
	navigateTo("/");
};
