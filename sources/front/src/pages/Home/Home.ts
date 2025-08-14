import Modal from "#components/Modals/Modal.ts";
import FormAuth from "#components/Forms/FormAuth/FormAuth.ts";
import Form2FA from "#components/Forms/Form2FA/Form2FA.ts";
import Button from "#components/Buttons/Button.ts";
import { handleAutoConnect } from "#requests/authRequest.ts";
import { btn_menu_container, home_background, menu_container } from "./style";
import { btn_nav } from "#components/Buttons/style.ts";
import { getStorage, setStorage } from "#services/data.ts";
import { useLanguage } from "#hooks/useLanguage.ts";
import NavigationBar from "#components/NavigationBar/NavigationBar.ts";
import type { User, UserForm } from "#types/user.ts";

import {
  createElement,
  navigateTo,
  useEffect,
  useState,
} from "#core/framework.ts";
import { KeysStorage } from "#types/enums.ts";
import ModalError from "#components/Modals/ModalError/ModalError.ts";
import { modal_a2f, modal_background } from "#components/Modals/style.ts";
import { useContext } from "#core/hooks/useContext.ts";

const Home = () => {
  const [modalAuth, setModalAuth] = useState(false);
  const [modal2FA, setModal2FA] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [showModalError, setShowModalError] = useState(false);
  const [tempUser, setTempUser] = useState<UserForm | null>(null);

  const [_get, setContext] = useContext();

  setContext("user", user);
  setContext("setUser", setUser);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const id = urlParams.get("id");
    const configuration = getStorage(localStorage, KeysStorage.CONFTRANS);

    if (id && token) {
      setStorage(localStorage, KeysStorage.CONFTRANS, {
        token,
        id,
        lang: configuration?.lang ?? "FR",
      });
      window.history.replaceState({}, "", "/");
    }
  }, [user]);

  useEffect(async () => {
    await handleAutoConnect(setUser);
  }, []);

  return createElement(
    "div",
    { id: "home", class: home_background },
    NavigationBar({
      modalState: { modalAuth, setModalAuth },
    }),
    createElement(
      "div",
      { class: menu_container },
      createElement(
        "div",
        { class: btn_menu_container },
        Button({
          children: useLanguage("local"),
          attr: { class: btn_nav, onClick: () => navigateTo("/local") },
        }),
        user &&
          Button({
            children: useLanguage("multiplayer"),
            attr: { class: btn_nav, onClick: () => navigateTo("/multiplayer") },
          })
      )
    ),
    ModalError({
      showModalState: [showModalError, setShowModalError],
      Error: error,
    }),
    Modal(
      { state: modalAuth, setter: setModalAuth },
      FormAuth({
        setModal: setModalAuth,
        set2FA: setModal2FA,
        setUser,
        setError,
        setShowModalError,
        setTempUser,
      })
    ),
    Modal(
      {
        state: modal2FA,
        setter: setModal2FA,
        attr: { class: modal_a2f },
        attrBackground: { class: modal_background + "z-2" },
      },
      Form2FA({
        setterUser: setUser,
        setterAuth: setModalAuth,
        setter2FA: setModal2FA,
        setError,
        setShowModalError,
        tempUser,
      })
    )
  );
};

export default Home;
