import {
  API_USER_ROUTES,
  fetchAPI,
  getStorage,
  setStorage,
} from "#services/data.ts";
import { KeysStorage } from "#types/enums.ts";
import type { UserEditForm } from "#types/user.ts";
import _ from "lodash";

const localuser = getStorage(localStorage, KeysStorage.CONFTRANS);

export const handleEditUser = async (edituser: UserEditForm) => {
  try {
    const response = await fetchAPI(
      import.meta.env.VITE_API_USER +
        API_USER_ROUTES.CRUD_USER +
        `/${localuser.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localuser.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(edituser),
      }
    );

    if (response.error) {
      console.error(
        "Erreur lors de la mise à jour de l'utilisateur:",
        response
      );
    } else {
      // Si tout est bon, mettez à jour le stockage
      if (response) setStorage(sessionStorage, KeysStorage.USERTRANS, response);
      console.log("Utilisateur mis à jour avec succès:", response);
    }
  } catch (error) {
    console.error("Une erreur est survenue lors de la requête:", error);
  }
};
