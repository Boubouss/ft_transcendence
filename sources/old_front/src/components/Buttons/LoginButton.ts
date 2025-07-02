import { navigateTo } from "@/router";
import { type CustomButtonOptions } from "@/components/Buttons/CustomButton";
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
      padding: "p-[10px]",
      height: "80px",
      onClick: () => navigateTo("/account"),
    };
  } else {
    return {
      text: `${t("loginin")} / ${t("signin")}`,
      textColor: "text-white",
      borderColor: "border-black",
      fontStyle: "font-jaro font-semibold",
      fontSizeClass: "text-3xl",
      width: "220px",
      onClick: () => navigateTo("/sign"),
    };
  }
}
