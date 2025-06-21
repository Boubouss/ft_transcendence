import { navigateTo } from "@/router";
import { createCustomButton, type CustomButtonOptions } from "@/components/Buttons/CustomButton";
import { t } from "@utils/i18n";
import * as authStorage from "@utils/authStorage";

export function getFriendsButtonOptions(): CustomButtonOptions {
	const isMobile = window.innerWidth < 640;

  if (isMobile) {
	return {
	//  text: t("friends"),
	text: "Friends",
	  textColor: "text-white",
	  borderColor: "border-black",
	  fontStyle: "font-jaro font-semibold",
	  fontSizeClass: "text-3xl",
	  width: "",
	  height: "80px",
	  padding: "p-[10px]",
	  onClick: () => navigateTo("account"),
	};
  } else {
	return {
	  textColor: "text-white",
	  borderColor: "border-black",
	  imageUrl: "assets/icons/friends_icon.png",
	  fontStyle: "font-jaro font-semibold",
	  fontSizeClass: "text-3xl",
	  width: "220px",
	  height: "80px",
	  onClick: () => navigateTo("sign"),
	};
  }
}
