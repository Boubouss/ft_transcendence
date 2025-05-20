// renderAccount.ts
import { createAccountPage } from "./AccountModal";
import { navigateTo } from "@/router";
import * as accbutton from "@components/Buttons/AccountButtons";
import { EnableDisableA2F } from "../Sign/A2F";
import { createToggleEditMode } from "@pages/Account/utils";
import { initializeAccountContent } from "@pages/Account/utils";
import * as authStorage from "@utils/authStorage";

export function renderAccount() {
  const isMobile = window.innerWidth < 640;
  if (isMobile) {
    renderAccountMobile();
  } else {
    renderAccountDesktop();
  }
}

/*__  __  ___  ___ ___ _    ___  __   _____ ___  ___ ___ ___  _  _
 |  \/  |/ _ \| _ )_ _| |  | __| \ \ / / __| _ \/ __|_ _/ _ \| \| |
 | |\/| | (_) | _ \| || |__| _|   \ V /| _||   /\__ \| | (_) | .` |
 |_|  |_|\___/|___/___|____|___|   \_/ |___|_|_\|___/___\___/|_|\_|
                                                                    */

function renderAccountMobile() {
  const menuModal = document.getElementById("menu-modal");
  if (menuModal) {
    menuModal.style.transform = "translateX(100%)";
    setTimeout(() => menuModal.remove(), 300);
  }

  const container = document.getElementById("app-root")!;
  container.innerHTML = "";
  const mobilePage = createAccountPage();
  container.appendChild(mobilePage);

  // ✅ Ajoute le bouton dans le coin haut droit du contenu
  const closeButton = accbutton.createCloseModalButton(() =>
    navigateTo("home")
  ); // ou une autre action
  Object.assign(closeButton.style, {
    position: "absolute",
    top: "12px",
    right: "12px",
    zIndex: "50",
  });
  // Assure-toi que mobilePage est `relative` sinon ça sortira du cadre
  mobilePage.style.position = "relative";
  mobilePage.appendChild(closeButton);

  setupContent(container, null);
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
    zIndex: "1000",
  });

  const modalInner = createAccountPage(true);
  modal.appendChild(modalInner);
  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      if (authStorage.getA2FfromConfig() != null)
        authStorage.getSignificant2FA(), modal.remove();
    }
  });

  const closeButton = accbutton.createCloseModalButton(() => {
    if (authStorage.getA2FfromConfig() != null)
      authStorage.getSignificant2FA(), modal.remove();
  });
  Object.assign(closeButton.style, {
    position: "absolute",
    top: "40px",
    right: "40px",
    zIndex: "1010",
  });
  modal.appendChild(closeButton);

  navigateTo("home");
  setupContent(modalInner, modal);
}

function setupContent(container: HTMLElement, modal: HTMLElement | null) {
  const elements = initializeAccountContent(container);

  const isModal = !!modal;
  let isEdit = false; // mode édition

  const avatarSection = container.querySelector(
    "#avatar-section"
  ) as HTMLElement;
  const sideButtonsContainer = container.querySelector(
    "#side-buttons"
  ) as HTMLElement;
  const mobileEditButtons = container.querySelector(
    "#mobile-edit-buttons"
  ) as HTMLElement;

  // Crée les boutons
  const a2fButton = accbutton.createA2FButton(EnableDisableA2F);
  const avatarButton = accbutton.createAvatarButton();

  // Fonction pour appliquer le style avatar selon isEdit
  function updateAvatarLayout(overrideIsEdit?: boolean) {
    // Utilise overrideIsEdit s’il est défini, sinon la variable isEdit
    const editMode = overrideIsEdit !== undefined ? overrideIsEdit : isEdit;

    if (editMode) {
      if (window.innerWidth >= 640) {
        avatarSection.classList.remove("items-center", "justify-center");
        avatarSection.classList.add(
          "items-start",
          "justify-start",
          "sm:flex-row"
        );
        sideButtonsContainer.style.display = "flex";
      } else {
        avatarSection.classList.remove("items-start", "justify-start");
        avatarSection.classList.add(
          "items-center",
          "justify-center",
          "flex-col"
        );
        sideButtonsContainer.style.display = "none";
      }
    } else {
      avatarSection.classList.remove("items-start", "justify-start");
      avatarSection.classList.add("items-center", "justify-center");
      sideButtonsContainer.style.display = "none";
    }
  }

  updateAvatarLayout(); // init

  // Placement des boutons
  if (isModal && sideButtonsContainer) {
    sideButtonsContainer.appendChild(a2fButton);
    sideButtonsContainer.appendChild(avatarButton);
  } else if (mobileEditButtons) {
    mobileEditButtons.appendChild(a2fButton);
    mobileEditButtons.appendChild(avatarButton);
  }

  // Bouton éditer
  const toggleEditMode = createToggleEditMode(
    elements,
    isModal,
    updateAvatarLayout
  );

  elements.buttonContainer.appendChild(
    accbutton.createEditInfoButton(() => {
      isEdit = !isEdit;
      updateAvatarLayout();
      toggleEditMode();
    })
  );

  if (modal) {
    navigateTo("home");
  }
}
