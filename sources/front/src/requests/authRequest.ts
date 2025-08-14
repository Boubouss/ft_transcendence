import { useForm } from "#hooks/useForm.ts";
import type { User, UserForm } from "#types/user.ts";

import {
  API_USER_ROUTES,
  fetchAPI,
  getStorage,
  removeStorage,
  replaceStorage,
  setStorage,
} from "#services/data.ts";
import { KeysStorage } from "#types/enums.ts";
import _ from "lodash";
import { VerifForm, VerifRequiredInput } from "./Validations";
import { useLanguage } from "#hooks/useLanguage.ts";
import { useState } from "#core/framework.ts";
import { mapUserFormToUser } from "#services/utils.ts";

export const handleConnexion = async (
  set2FA: (toSet: boolean) => void,
  setUser: (toSet: User | null) => void,
  setError: (toSet: string) => void,
  setShowModalError: (toSet: boolean) => void,
  setTempUser: (toSet: UserForm | null) => void
) => {
  const form = useForm("form_auth");
  const data = {
    name: form?.get("name")?.toString() || "",
    password: form?.get("password")?.toString() || "",
  };

  if (!VerifRequiredInput(data, setError) || !VerifForm(data, setError)) {
    setError(useLanguage("error_user_not_found"));

    setShowModalError(true);
    return;
  }

  const user = await fetchAPI(
    import.meta.env.VITE_API_USER + API_USER_ROUTES.LOGIN,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  if (user && _.isUndefined(user.error)) {
    const { token, ...userData } = user;

    if (token) {
      setStorage(sessionStorage, KeysStorage.USERTRANS, userData);

      setStorage(localStorage, KeysStorage.CONFTRANS, {
        id: user.id,
        token: user.token,
      });
      setUser(getStorage(sessionStorage, KeysStorage.USERTRANS));
      //navigateTo("/");
    } else {
      setTempUser(userData);
      setStorage(localStorage, KeysStorage.CONFTRANS, {
        id: user.id,
      });
      set2FA(true);
    }
  } else {
    setError(useLanguage("error_user_not_found"));

    setShowModalError(true);
  }
};

export const handleRegister = async (
  setter: (toSet: boolean) => void,
  setError: (toSet: string) => void,
  setTempUser: (toSet: UserForm | null) => void,
  setShowModalError: (toSet: boolean) => void,
  setModalRegister: (toSet: boolean) => void
) => {
  const [isDisable, setDisabled] = useState(false);
  if (!isDisable) {
    setDisabled(true);
  } else {
    return;
  }

  const form = useForm("form_auth");
  const data = {
    email: form?.get("email")?.toString(),
    name: form?.get("name")?.toString(),
    password: form?.get("password")?.toString(),
  };

  if (!VerifRequiredInput(data, setError) || !VerifForm(data, setError)) {
    setDisabled(false);
    setShowModalError(true);
    return;
  }

  const user = await fetchAPI(
    import.meta.env.VITE_API_USER + API_USER_ROUTES.REGISTER,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  if (user && _.isUndefined(user.error)) {
    setModalRegister(false);
    setDisabled(false);

    setStorage(localStorage, KeysStorage.CONFTRANS, {
      id: user.id,
    });
    setTempUser(user);
    setter(true);
  } else {
    setDisabled(false);
    setError(useLanguage("error_account"));
    setShowModalError(true);
  }
};

export const handle2FA = async (
  setUser: (toSet: User | null) => void,
  set2FA: (toSet: boolean) => void,
  setError: (toSet: string) => void,
  setShowModalError: (toSet: boolean) => void,
  tempUser: UserForm | null
) => {
  const user = tempUser;
  const form = useForm("form_2FA");

  const data = {
    code: form?.get("code"),
    name: user?.name,
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

  if (token && tempUser && token.token) {
    setStorage(localStorage, KeysStorage.CONFTRANS, { id: user?.id, ...token });
    setStorage(sessionStorage, KeysStorage.USERTRANS, tempUser);

    const typeuser: User = mapUserFormToUser(tempUser);

    setUser(typeuser);
    set2FA(false);
    //navigateTo("/");
  } else {
    setError(useLanguage("alerta2f"));
    setShowModalError(true);
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
    if (user && !user.code)
      setStorage(sessionStorage, KeysStorage.USERTRANS, user);
    else
      replaceStorage(localStorage, KeysStorage.CONFTRANS, {
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

export const handleDeconnexion = (setUser: (toSet: User | null) => void) => {
  const configuration = getStorage(localStorage, KeysStorage.CONFTRANS);
  replaceStorage(localStorage, KeysStorage.CONFTRANS, {
    lang: configuration.lang,
  });
  removeStorage(sessionStorage, KeysStorage.USERTRANS);
  if (setUser) setUser(null);
};
