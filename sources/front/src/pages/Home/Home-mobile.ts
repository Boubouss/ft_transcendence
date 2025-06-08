import { createCustomButton } from "@/components/Buttons/CustomButton";
import { getSignButtonOptions } from "@/components/Buttons/LoginButton";
import { createLangDropdown } from "@/components/Buttons/LangButton";
import { t } from "@/utils/i18n";
import { createAccountMobilePage } from "../Account/AccountMobilePage";
import { createLogoutButton } from "@/components/Buttons/AccountButtons";
import { navigateTo } from "@/router";
import * as authStorage from "@/utils/authStorage";

export const mobileMenuButton = createCustomButton({
  width: "60px",
  height: "60px",
  borderRadius: "rounded-[20px]",
  position: "sm:hidden absolute top-4 right-4 z-50",
  imageUrl: "/assets/icons/mobile_menu.png",
  imageWidth: "50px",
  imageHeight: "50px",
  onClick: () => {
    createModalMenuMobile();
  },
});

export function createModalMenuMobile(): HTMLDivElement {
  const modal = document.createElement("div");
  modal.id = "menu-modal";

  Object.assign(modal.style, {
    position: "fixed",
    top: "0",
    right: "0",
    width: "55vw",
    maxWidth: "400px",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    transform: "translateX(100%)",
    transition: "transform 0.3s ease-in-out",
    zIndex: "1000",
  });

  // === Ajout au body et déclenche l'animation ===
  document.body.appendChild(modal);
  setTimeout(() => {
    modal.style.transform = "translateX(0)";
  }, 10);

  // === Bouton de fermeture ===
  const closeButton = createCustomButton({
    imageUrl: "/assets/icons/close_icon.png",
    imageWidth: "30px",
    imageHeight: "30px",
    width: "50px",
    height: "60px",
    position: "absolute top-4 right-4",
    onClick: () => {
      modal.style.transform = "translateX(100%)";
      setTimeout(() => modal.remove(), 300);
    },
  });

  const SignButtonOptions = getSignButtonOptions();
  const SignButton = createCustomButton({
    ...SignButtonOptions,
    width: "70%",
    height: "75px",
    position: "absolute top-[15%] right-7",
    padding: "p-[5px]",
  });

  let logoutButton = null;

  if (authStorage.getUser() !== null) {
    logoutButton = createLogoutButton(modal);
  }

  const LangContainer = createLangDropdown();
  LangContainer.className = "absolute top-[30%] left-[25%]";

  modal.appendChild(closeButton);
  if (logoutButton) modal.appendChild(logoutButton);
  modal.appendChild(LangContainer);
  modal.appendChild(SignButton);

  return modal;
}
