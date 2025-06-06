import { navigateTo } from "@/router";
import type { CustomButtonOptions,} from "@/components/Buttons/CustomButton";
import { t } from "@utils/i18n";
import * as authStorage from "@utils/authStorage";

export function getSignButtonOptions(): CustomButtonOptions {
  const isLoggedIn = !!authStorage.getToken();

  if (isLoggedIn) {
    return {
      text: t("myacc"),
      textColor: "text-white",
      borderColor: "border-black",
      fontStyle: "font-jaro font-semibold",
      fontSizeClass: "text-3xl",
      width: "",
      height: "80px",
      padding: "p-[10px]",
      position: "hidden sm:block absolute top-10 right-10",
      onClick: () => navigateTo("account"),
    };
  } else {
    return {
      text: `${t("signin")} / ${t("signup")}`,
      textColor: "text-white",
      borderColor: "border-black",
      fontStyle: "font-jaro font-semibold",
      fontSizeClass: "text-3xl",
      width: "220px",
      height: "80px",
      position: "hidden sm:block absolute top-10 right-10",
      onClick: () => navigateTo("sign"),
    };
  }
}
