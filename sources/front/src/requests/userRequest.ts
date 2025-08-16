import ModalError from "#components/Modals/ModalError/ModalError.ts";
import { useState } from "#core/framework.ts";
import { useForm } from "#hooks/useForm.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import {
  API_USER_ROUTES,
  fetchAPI,
  getStorage,
  setStorage,
} from "#services/data.ts";
import { KeysStorage } from "#types/enums.ts";
import type { User } from "#types/user.ts";
import _ from "lodash";

function isValidEmail(email: string, setError: (toSet: string) => void) {
  if (_.isEmpty(email) || _.isUndefined(email)) return true;

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    setError(useLanguage("error_email_format"));
    return false;
  }
  return true;
}

function isValidPassword(password: string, setError: (toSet: string) => void) {
  if (_.isEmpty(password) || _.isUndefined(password)) return true;

  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
  if (!regex.test(password)) {
    setError(useLanguage("error_pw_complexity"));
    return false;
  } else if (password.length < 8) {
    setError(useLanguage("error_pw_length"));
    return false;
  }
  return true;
}

function isValidName(name: string, setError: (toSet: string) => void) {
  if (_.isEmpty(name) || _.isUndefined(name)) return true;

  if (name.length < 3 || name.length > 20) {
    setError(useLanguage("error_name_length"));
    return false;
  }
  return true;
}

const VerifForm = (
  form: FormData | null,
  setError: (toSet: string) => void
) => {
  const new_form = form;
  const email = new_form?.get("email")?.toString() ?? "";
  const name = new_form?.get("name")?.toString() ?? "";
  const password = new_form?.get("password")?.toString() ?? "";

  return (
    isValidEmail(email, setError) &&
    isValidPassword(password, setError) &&
    isValidName(name, setError)
  );
};

export const handleEditUser = async (
  user: User,
  setUser: (toSet: User) => void,
  setEdit: (toSet: boolean) => void,
  setShowModal: (toSet: boolean) => void,
  setError: (toSet: string) => void
) => {
  const localuser = getStorage(localStorage, KeysStorage.CONFTRANS);

  const form = useForm("form-account");
  if (!VerifForm(form, setError)) {
    setShowModal(true);
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
      setUser(getStorage(sessionStorage, KeysStorage.USERTRANS));
      console.log("Utilisateur mis à jour avec succès:", response.data);
      setEdit(false);
    } else {
      console.log("Mise à jour échouée sans message d'erreur.");
      setError(useLanguage("error_update_account"));

      setShowModal(true);
    }
  } catch (error) {
    console.error("Une erreur est survenue lors de la requête:", error);
    setError(useLanguage("error_update_account"));

    setShowModal(true);
  }
};
