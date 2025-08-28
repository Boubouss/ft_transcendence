import { useForm } from "#hooks/useForm.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import {
  API_USER_ROUTES,
  fetchAPI,
  getStorage,
  setStorage,
} from "#services/data.ts";
import { KeysStorage } from "#types/enums.ts";
import _ from "lodash";
import { useValidation } from "../hooks/useValidation";
import { useContext } from "#core/hooks/useContext.ts";
import type { UserState } from "#pages/Multiplayer/Multiplayer.ts";

export const handleEditUser = async (
  setEdit: (toSet: boolean) => void,
  setShowModalError: (toSet: boolean) => void,
  setError: (toSet: string) => void
) => {
  const localuser = getStorage(localStorage, KeysStorage.CONFTRANS);

  const [getContext, _set] = useContext();
  const [user, setUser] = getContext("user") as UserState;

  const form = useForm("form-account");
  const email = form?.get("email")?.toString() ?? "";
  const name = form?.get("name")?.toString() ?? "";
  const password = form?.get("password")?.toString() ?? "";

  const data = {
    email: email,
    name: name,
    password: password,
  };

  const [_complete, isValid] = useValidation();

  if (!isValid(data, setError)) {
    setShowModalError(true);
    return;
  }

  if (form?.has("is2FA")) {
    form.set("is2FA", "true");
  } else {
    form?.set("is2FA", "false");
  }

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
      setUser(response.data);
      setEdit(false);
    } else {
      console.log("Mise à jour échouée sans message d'erreur.");
      setError(useLanguage("error_update_account"));

      setShowModalError(true);
    }
  } catch (error) {
    console.error("Une erreur est survenue lors de la requête:", error);
    setError(useLanguage("error_update_account"));

    setShowModalError(true);
  }
};
