import { createElement } from "#core/render.ts";
import {
  account_background,
  account_container,
  button_close,
  image_button_close,
  title_container,
  title_page_account,
  account_page,
} from "./style";
import { useLanguage } from "#hooks/useLanguage.ts";
import { navigateTo, useState } from "#core/framework.ts";
import { getStorage } from "#services/data.ts";
import { KeysStorage } from "#types/enums.ts";
import _ from "lodash";
import NavigationBar from "#components/NavigationBar/NavigationBar.ts";
import FormAccount from "#components/Forms/FormAccount/FormAccount.ts";

const Account = () => {
  const user = getStorage(sessionStorage, KeysStorage.USERTRANS);

  const [isUser, setUserState] = useState(user);

  return createElement(
    "div",
    { id: "account_background", class: account_background },
    NavigationBar({ userState: { user: isUser, setUser: setUserState } }),
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
        FormAccount()
      )
    )
  );
};

export default Account;
