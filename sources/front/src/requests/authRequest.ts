import { useForm } from "#hooks/useForm.ts";
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
import { useValidation } from "../hooks/useValidation";
import { useLanguage } from "#hooks/useLanguage.ts";
import { useContext } from "#core/hooks/useContext.ts";
import type { UserState } from "#pages/Multiplayer/Multiplayer.ts";

export const handleConnexion = async (
  set2FA: (toSet: boolean) => void,
  setError: (toSet: string) => void,
  setShowModalError: (toSet: boolean) => void
) => {
  const form = useForm("form_auth");
  const data = {
    name: form?.get("name")?.toString() || "",
    password: form?.get("password")?.toString() || "",
  };
  const [isComplete, isValid] = useValidation();
  const [getContext, _set] = useContext();

  const [_userContext, setUser] = getContext("user") as UserState;

  if (!isComplete(data, setError) || !isValid(data, setError)) {
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
    } else {
      setUser(userData);
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
  setter2FA: (toSet: boolean) => void,
  setError: (toSet: string) => void,
  setShowModalError: (toSet: boolean) => void,
  setModalRegister: (toSet: boolean) => void
) => {
  const [getContext, _set] = useContext();
  const [_userContext, setUser] = getContext("user") as UserState;

  const form = useForm("form_auth");
  const data = {
    email: form?.get("email")?.toString(),
    name: form?.get("name")?.toString(),
    password: form?.get("password")?.toString(),
  };
  const [isComplete, isValid] = useValidation();

  if (!isComplete(data, setError) || !isValid(data, setError)) {
    setShowModalError(true);
    return;
  }
  setModalRegister(false);

  const user = await fetchAPI(
    import.meta.env.VITE_API_USER + API_USER_ROUTES.REGISTER,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  if (user && _.isUndefined(user.error)) {
    setStorage(localStorage, KeysStorage.CONFTRANS, {
      id: user.id,
    });
    setUser(user);
    setter2FA(true);
  } else {
    setError(useLanguage("error_account"));
    setModalRegister(true);
    setShowModalError(true);
  }
};

export const handle2FA = async (
  set2FA: (toSet: boolean) => void,
  setError: (toSet: string) => void,
  setShowModalError: (toSet: boolean) => void
) => {
  const [getContext, _set] = useContext();
  const [user, setUser] = getContext("user") as UserState;
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

  if (token && user && token.token) {
    setStorage(localStorage, KeysStorage.CONFTRANS, { id: user?.id, ...token });
    setStorage(sessionStorage, KeysStorage.USERTRANS, user);

    setUser(user);
    set2FA(false);
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

export const handleAutoConnect = async () => {
  const configuration: {
    id: string;
    token: string;
    lang?: string;
  } = getStorage(localStorage, KeysStorage.CONFTRANS);
  const [getContext, _set] = useContext();
  const [_user, setUser] = getContext("user") as UserState;
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
    setUser(getStorage(sessionStorage, KeysStorage.USERTRANS));
  }
};

export const handleDeconnexion = () => {
  const [getContext, _set] = useContext();
  const [_user, setUser] = getContext("user") as UserState;
  const configuration = getStorage(localStorage, KeysStorage.CONFTRANS);
  replaceStorage(localStorage, KeysStorage.CONFTRANS, {
    lang: configuration.lang,
  });
  removeStorage(sessionStorage, KeysStorage.USERTRANS);
  if (setUser) setUser(null);
};
