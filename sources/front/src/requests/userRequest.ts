import { useForm } from "#hooks/useForm.ts";
import {
	API_USER_ROUTES,
	fetchAPI,
	getStorage,
	setStorage,
} from "#services/data.ts";
import { KeysStorage } from "#types/enums.ts";
import type { User } from "#types/user.ts";
import _ from "lodash";

export const handleEditUser = async (
	user: User,
	setUser: (toSet: User) => void
) => {
	const localuser = getStorage(localStorage, KeysStorage.CONFTRANS);

	const form = useForm("form-account");

	console.log(form);

	console.log(form?.get("is2FA"));

	if (form?.has("is2FA")) {
		form.set("is2FA", "true");
	} else {
		form?.set("is2FA", "false");
	}

	console.log(form);

	try {
		const response = await fetchAPI(
			import.meta.env.VITE_API_USER +
				API_USER_ROUTES.CRUD_USER +
				`/${localuser.id}`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${localuser.token}`,
				},
				body: form,
			}
		);

		if (response.event === "ERROR") {
			setUser(user);

			console.error(
				"Erreur lors de la mise à jour de l'utilisateur:",
				response.error
			);
		} else if (response.data) {
			setStorage(sessionStorage, KeysStorage.USERTRANS, response.data);
			setUser(getStorage(sessionStorage, KeysStorage.USERTRANS));
			console.log("Utilisateur mis à jour avec succès:", response.data);
		} else {
			console.log("Mise à jour échouée sans message d'erreur.");
		}
	} catch (error) {
		console.error("Une erreur est survenue lors de la requête:", error);
	}
};
