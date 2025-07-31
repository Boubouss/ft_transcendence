import { useForm } from "#hooks/useForm.ts";
import {
  API_USER_ROUTES,
  fetchAPI,
  getStorage,
  setStorage,
} from "#services/data.ts";
import { Form_ID, KeysStorage } from "#types/enums.ts";
import type { User, UserEditForm } from "#types/user.ts";
import _ from "lodash";

export const avatar_img = (user: User) => {
  return (
    import.meta.env.VITE_API_USER +
    API_USER_ROUTES.DOWNLOAD_AVATAR +
    `/avatar_${user.id}.jpg`
  );
};

export const handleEditAccount = (props: {
  setA2F: (toSet: boolean) => void;
}) => {
  const user = getStorage(sessionStorage, KeysStorage.USERTRANS);

  const form = useForm("form-account");
  const newname = form?.get("name")?.toString().trim();
  const newemail = form?.get("email")?.toString().trim();
  const newpsw = form?.get("password")?.toString().trim();
  const newavatar = form?.get("avatar");

  const { setA2F } = props;

  console.log(form);
  console.log(newavatar);

  const edituser: UserEditForm = {
    id: user.id,
    configuration: _.cloneDeep(user.configuration),
  };

  const compuser = _.cloneDeep(edituser);

  if (!_.isEmpty(newname)) edituser.name = newname;
  if (!_.isEmpty(newemail)) edituser.email = newemail;
  if (!_.isEmpty(newpsw)) edituser.password = newpsw;

  const a2fisnull_inform = _.isNull(form?.get(Form_ID.A2F));
  const a2f = user.configuration.is2FA;

  if (a2fisnull_inform && a2f === true) {
    edituser.configuration.is2FA = false;
    setA2F(false);
  } else if (!a2fisnull_inform && a2f === false) {
    edituser.configuration.is2FA = true;
    setA2F(true);
  }

  if (newavatar?.type !== "application/octet-stream") handleEditAvatar(form);

  if (JSON.stringify(edituser) != JSON.stringify(compuser))
    handleEditUser(edituser);
  else return;
};

const handleEditUser = async (edituser: UserEditForm) => {
  try {
    const localuser = getStorage(localStorage, KeysStorage.CONFTRANS);

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
      if (response) setStorage(sessionStorage, KeysStorage.USERTRANS, response);
      console.log("Utilisateur mis à jour avec succès:", response);
    }
  } catch (error) {
    console.error("Une erreur est survenue lors de la requête:", error);
  }
};

const handleEditAvatar = async (avatar) => {
  try {
    const localuser = getStorage(localStorage, KeysStorage.CONFTRANS);

    if (avatar instanceof File) {
      console.log("L'objet est un fichier valide.");
    } else {
      console.log("L'objet n'est pas un fichier valide.");
    }

    const response = await fetchAPI(
      import.meta.env.VITE_API_USER +
        API_USER_ROUTES.AVATAR_PLAYERS +
        `/${localuser.id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localuser.token}`,
        },
        body: avatar,
      }
    );

    if (response.error) {
      console.error(
        "Erreur lors de la mise à jour de l'utilisateur:",
        response
      );
    } else {
      //if (response) setStorage(sessionStorage, KeysStorage.USERTRANS, response);
      //console.log("Utilisateur mis à jour avec succès:", response);
      //console.log(response);
    }
  } catch (error) {
    console.error("Une erreur est survenue lors de la requête:", error);
  }
};
