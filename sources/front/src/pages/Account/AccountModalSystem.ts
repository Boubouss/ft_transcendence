// renderAccount.ts
import { createAccountModalInner } from "./AccountModal";
import { createAccountMobilePage } from "./AccountMobilePage";
import * as authStorage from "@utils/authStorage";
import { navigateTo } from "@/router";
import * as accbutton from "@components/Buttons/AccountButtons"
import { EnableDisableA2F } from "../Sign/A2F";


export function renderAccount() {
  const isMobile = window.innerWidth < 640;
  if (isMobile) {
    renderAccountMobile();
  } else {
    renderAccountDesktop();
  }
}

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
}

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
    zIndex: "1000"
  });

  const modalInner = createAccountModalInner();
  modal.appendChild(modalInner);
  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  setupModalContent(modalInner, modal);
}

function setupModalContent(container: HTMLElement, modal: HTMLElement) {
  const emailInput = container.querySelector<HTMLInputElement>("#email")!;
  const usernameInput = container.querySelector<HTMLInputElement>("#username")!;
  const oldPasswordInput = container.querySelector<HTMLInputElement>("#password")!;
  const newPasswordContainer = container.querySelector<HTMLDivElement>("#new-password-container")!;
  const newPasswordInput = container.querySelector<HTMLInputElement>("#new-password")!;
  const buttonContainer = container.querySelector<HTMLDivElement>("#button-container")!;

  const emailInit = authStorage.getUserValue("email");
  const usernameInit = authStorage.getUserValue("username");
  let isEditing = false;

 const toggleEditMode = () => {
  isEditing = !isEditing;
  emailInput.readOnly = !isEditing;
  usernameInput.readOnly = !isEditing;

  if (isEditing) {
    oldPasswordInput.readOnly = false;
    oldPasswordInput.value = "";
    oldPasswordInput.placeholder = "Ancien mot de passe";
    newPasswordContainer.style.display = "flex";
    newPasswordInput.value = "";

    buttonContainer.innerHTML = "";

    // On met le conteneur en flex row
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "12px"; // espace entre boutons
    buttonContainer.style.justifyContent = "center"; // centrer horizontalement

    buttonContainer.appendChild(
      accbutton.createValidateEditButton(() => {
        authStorage.setUserValue("email", emailInput.value);
        authStorage.setUserValue("username", usernameInput.value);
        toggleEditMode();
        navigateTo("home");
      })
    );
    buttonContainer.appendChild(
      accbutton.createCancelEditButton(() => {
        emailInput.value = emailInit;
        usernameInput.value = usernameInit;
        oldPasswordInput.value = "";
        newPasswordInput.value = "";
        toggleEditMode();
      })
    );
  } else {
    oldPasswordInput.readOnly = true;
    oldPasswordInput.value = "******";
    newPasswordContainer.style.display = "none";

    buttonContainer.innerHTML = "";

    // Quand on repasse en mode non édition, on peut remettre display block (ou vide)
    buttonContainer.style.display = "";
    buttonContainer.style.gap = "";
    buttonContainer.style.justifyContent = "";

    buttonContainer.appendChild(accbutton.createEditInfoButton(toggleEditMode));
  }
};


  buttonContainer.appendChild(accbutton.createEditInfoButton(toggleEditMode));

  container.appendChild(accbutton.createCloseModalButton(() => modal.remove()));
  container.appendChild(accbutton.createA2FButton(EnableDisableA2F));
  container.appendChild(
    accbutton.createLogoutButton(() => {
      authStorage.clearAuth();
      navigateTo("home");
      modal.remove();
    })
  );
  container.appendChild(accbutton.createAvatarButton());



  navigateTo("home");
}
