import { createElement } from "#core/render.ts";
import {
  account_container,
  title_container,
  title_page_account,
  account_page,
} from "./style";
import { useLanguage } from "#hooks/useLanguage.ts";
import { useState } from "#core/framework.ts";
import _ from "lodash";
import NavigationBar from "#components/NavigationBar/NavigationBar.ts";
import FormAccount from "#components/Forms/FormAccount/FormAccount.ts";
import ModalError from "#components/Modals/ModalError/ModalError.ts";
import { home_background } from "#pages/Home/style.ts";

const Account = () => {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");


  return createElement(
    "div",
    { id: "account_background", class: home_background },
    NavigationBar({}),
    createElement(
      "div",
      { class: account_page },
      createElement(
        "div",
        { id: "account_container", class: account_container },
        createElement(
          "div",
          { class: title_container },
          createElement(
            "h2",
            { name: "account_title", class: title_page_account },
            useLanguage("myacc")
          )
        ),
        FormAccount(setShowModal, setError)
      ),
      ModalError({
        showModalState: [showModal, setShowModal],
        Error: error,
      })
    )
  );
};

export default Account;
