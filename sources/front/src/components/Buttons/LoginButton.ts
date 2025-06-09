import { navigateTo } from "@/router";
import { createCustomButton, type CustomButtonOptions } from "@/components/Buttons/CustomButton";
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
      onHover: (buttonElement: HTMLElement) => {
        // Empêche duplication si le bouton existe déjà
        if (buttonElement.querySelector(".disconnect-btn")) return;

        const disconnectBtn = createCustomButton({
          text: t("disco"),
          position: "absolute top-[100%] right-[0] zIndex-[50]",
          backgroundColor: "bg-red-500",
          borderRadius: "rounded-[15px]",
          onClick: (event) => (
            event.stopPropagation(),
            authStorage.clearAuth(),
            location.reload()
          ),
        })
        disconnectBtn.className +=
          "disconnect-btn mt-2 px-4 py-2 bg-orange-500 text-white shadow-lg transition duration-200";

        buttonElement.appendChild(disconnectBtn);

        let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

        const removeDisconnect = () => {
          hoverTimeout = setTimeout(() => {
            disconnectBtn.remove();
          }, 250); // ← délai de 250 ms
        };

        const cancelRemoval = () => {
          if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            hoverTimeout = null;
          }
        };

        buttonElement.addEventListener("mouseleave", removeDisconnect);
        disconnectBtn.addEventListener("mouseenter", cancelRemoval);
        disconnectBtn.addEventListener("mouseleave", removeDisconnect);
      },
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
