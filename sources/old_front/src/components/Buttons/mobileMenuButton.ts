import { createCustomButton } from "@/components/Buttons/CustomButton";
import { getSignButtonOptions } from "@/components/Buttons/LoginButton";
import { createLangDropdown } from "@/components/Buttons/LangButton";
import { createLogoutButton } from "@/components/Buttons/AccountButtons";
import * as authStorage from "@/utils/authStorage";
import { getFriendsButtonOptions } from "@/components/Buttons/FriendsButton";

export const mobileMenuButton = createCustomButton({
  height: "60px",
  borderRadius: "rounded-[20px]",
  position: "sm:hidden absolute top-4 right-4",
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

  modal.className = `
  fixed
  inset-0
  flex
  items-center
  justify-center
  backdrop-filter
  backdrop-blur-md
  transform
  transition
  duration-300
  ease-in-out
  -translate-y-full
`;

  document.body.appendChild(modal);

  setTimeout(() => {
    modal.classList.replace("-translate-y-full", "translate-y-0");
  }, 10);

  const content = document.createElement("div");
  Object.assign(content.style, {
    alignItems: "center",
  });
  modal.appendChild(content);

  content.className = `
  relative
  w-full
  h-full
  flex
  flex-col
  `;
  // Bouton close en haut à droite
  const closeButton = createCustomButton({
    imageUrl: "/assets/icons/close_icon.png",
    imageWidth: "30px",
    imageHeight: "30px",
    width: "50px",
    height: "60px",
    position: "absolute top-4 right-4",
    onClick: () => {
      modal.classList.replace("translate-y-0", "-translate-y-full");
      setTimeout(() => modal.remove(), 300);
    },
  });
  content.appendChild(closeButton);

  // Container pour les trois boutons alignés horizontalement
  const actionContainer = document.createElement("div");
  Object.assign(actionContainer.style, {
    display: "flex",
    flexDirection: "column",
    gap: "40px",
    marginTop: "200px",
  });

  // Boutons "My Account", "Language", "Disconnect"
  const LogoutButton = createLogoutButton(modal, false);
  const LangContainer = createLangDropdown();
  const SignButtonOptions = getSignButtonOptions();

  const SignButton = createCustomButton({
    ...SignButtonOptions,
  });

  const FriendsButtonOptions = getFriendsButtonOptions();

  const FriendsButton = createCustomButton({
    ...FriendsButtonOptions,
  });

  actionContainer.appendChild(LangContainer);

  actionContainer.appendChild(SignButton);
  if (authStorage.getToken()) {
    actionContainer.appendChild(LogoutButton);
    actionContainer.appendChild(FriendsButton);
  }

  content.appendChild(actionContainer);

  return modal;
}
