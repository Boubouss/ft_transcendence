// renderAccount.ts
import { createAccountModalInner } from "./AccountModal";
import { createAccountMobilePage } from "./AccountMobilePage";
import * as authStorage from "@utils/authStorage";
import { navigateTo } from "@/router";
import * as accbutton from "@components/Buttons/AccountButtons";
import { EnableDisableA2F } from "../Sign/A2F";
import { createToggleEditMode } from "@pages/Account/utils";
import { initializeAccountContent } from "@pages/Account/utils";

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
  const mobilePage = createAccountMobilePage();
  container.appendChild(mobilePage);

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

  const modalInner = createAccountModalInner();
  modal.appendChild(modalInner);
  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  setupContent(modalInner, modal);
}

function setupContent(container: HTMLElement, modal: HTMLElement | null) {
  const elements = initializeAccountContent(container);

  // Création des boutons A2F et Logout
  const a2fButton = accbutton.createA2FButton(EnableDisableA2F);
  const avatarButton = accbutton.createAvatarButton();

  container.appendChild(a2fButton);
  container.appendChild(avatarButton);

  const buttonColumn = document.createElement("div");
  buttonColumn.className =
    "flex flex-col gap-4 mt-6 sm:mt-0 sm:ml-auto sm:flex-row sm:items-center";

  // On crée toggleEditMode en lui passant les boutons
  const toggleEditMode = createToggleEditMode(
    elements,
    navigateTo,
    a2fButton,
    avatarButton
  );

  // Bouton modifier (éditer)
  elements.buttonContainer.appendChild(
    accbutton.createEditInfoButton(toggleEditMode)
  );

  if (modal) {
    navigateTo("home");
  }
}
