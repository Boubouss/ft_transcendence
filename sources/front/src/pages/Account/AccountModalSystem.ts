// renderAccount.ts
import { createCustomButton } from "@/components/Buttons/CustomButton";
import { createAccountPage } from "./AccountModal";
import { navigateTo } from "@/router";
import * as accbutton from "@components/Buttons/AccountButtons";
import { createToggleEditMode } from "@pages/Account/utils";
import { initializeAccountContent } from "@pages/Account/utils";
import * as authStorage from "@utils/authStorage";

export function renderAccount() {
  renderAccountDesktop();
}
/*___  ___ ___ _  _______ ___  ___  __   _____ ___  ___ ___ ___  _  _
 |   \| __/ __| |/ /_   _/ _ \| _ \ \ \ / / __| _ \/ __|_ _/ _ \| \| |
 | |) | _|\__ \ ' <  | || (_) |  _/  \ V /| _||   /\__ \| | (_) | .` |
 |___/|___|___/_|\_\ |_| \___/|_|     \_/ |___|_|_\|___/___\___/|_|\_|
                                                                       */

function renderAccountDesktop() {
  const existing = document.getElementById("account-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "account-modal";
  Object.assign(modal.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  });

  const modalInner = createAccountPage(true);

  const closeButton = accbutton.createCloseModalButton(() => {
    if (authStorage.getA2FfromConfig() != null)
      authStorage.getSignificant2FA(), modal.remove();
  });
  Object.assign(closeButton.style, {
    position: "absolute",
    top: "5px",
    right: "5px",
    border: "0",
  });

  modalInner.appendChild(closeButton);

  modal.appendChild(modalInner);
  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      if (authStorage.getA2FfromConfig() != null)
        authStorage.getSignificant2FA(), modal.remove();
    }
  });

  navigateTo("home");
  setupContent(modalInner, modal);
}

function setupContent(container: HTMLElement, modal: HTMLElement | null) {
  const elements = initializeAccountContent(container);

  let isEdit = false; // mode édition

  const mobileEditButtons = container.querySelector(
    "#mobile-edit-buttons"
  ) as HTMLElement;

  // Crée les boutons
  const a2fButton = accbutton.createA2FToggle();
  const avatarButton = accbutton.createAvatarButton();

  // Placement des boutons
  mobileEditButtons.appendChild(a2fButton);
  mobileEditButtons.appendChild(avatarButton);

  const ButtonEyes = createCustomButton({
    imageUrl: "assets/icons/eye_open.png",
    imageWidth: "50px",
    minWidth: "30px",
    borderRadius: "rounded-0",
    borderWidth: "border-0",
    backgroundColor: "transparent",
    onClick: () => {
      const eyeImg = ButtonEyes.querySelector("img");
      const pwd = elements.PasswordInput;
      pwd.type = pwd.type === "password" ? "text" : "password";


      // Basculer l'image
      if (eyeImg) {
        eyeImg.src = (pwd.type === "text") ? "assets/icons/eye_closed.png" : "assets/icons/eye_open.png";
      }
    },
  });


  elements.buttonEyes.appendChild(ButtonEyes);
  // Bouton éditer
  const toggleEditMode = createToggleEditMode(elements);

  elements.buttonContainer.appendChild(
    accbutton.createEditInfoButton(() => {
      isEdit = !isEdit;
      toggleEditMode();
    })
  );

  if (modal) {
    navigateTo("home");
  }
}
