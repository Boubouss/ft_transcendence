// AccountModalSystem.ts
import { createAccountModal } from "./AccountModal";
import * as authStorage from "../../utils/authStorage";
import { createCustomButton } from "../../components/Buttons/CustomButton";
import { navigateTo } from "../../router";
import { EnableDisableA2F } from "../Sign/A2F";

export function renderAccount() {
  const existing = document.getElementById("account-modal");
  if (existing) existing.remove();

  const modal = createAccountModal();
  document.body.appendChild(modal);

  const modalContainer = modal.querySelector(".relative")!;
  modalContainer.addEventListener("click", (e) => e.stopPropagation());

  const closeButton = createCustomButton({
    width: "60px",
    height: "60px",
    borderRadius: "rounded-[20px]",
    position: "absolute top-5 right-5",
    imageUrl: "/assets/icons/close_icon.png",
    imageWidth: "38px",
    imageHeight: "38px",
    onClick: () => modal.remove(),
  });
  modalContainer.appendChild(closeButton);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  const toggle = modal.querySelector<HTMLImageElement>("#toggle-password");
  const passwordInput = modal.querySelector<HTMLInputElement>("#password");
  if (toggle && passwordInput) {
    toggle.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      passwordInput.value = isHidden ? "coucou" : "******";
      toggle.src = isHidden
        ? "/assets/icons/close_eye.png"
        : "/assets/icons/open_eye.png";
    });
  }

  const emailInit = authStorage.getUserValue("email");
  const usernameInit = authStorage.getUserValue("username");
  const buttonContainer =
    modal.querySelector<HTMLDivElement>("#button-container")!;

  let isEditing = false;
  const modifyButton = createCustomButton({
    height: "50px",
    borderRadius: "rounded-[20px]",
    text: "Modifier les informations",
    fontSizeClass: "text-2xl",
    padding: "p-[10px]",
    onClick: () => toggleEditMode(),
  });

  const validateButton = createCustomButton({
    width: "120px",
    height: "50px",
    borderRadius: "rounded-[20px]",
    text: "Valider",
    onClick: () => {
      valideModif();
    },
  });

  const cancelButton = createCustomButton({
    width: "120px",
    height: "50px",
    borderRadius: "rounded-[20px]",
    text: "Annuler",
    onClick: () => {
      modal.querySelector<HTMLInputElement>("#email")!.value = emailInit;
      modal.querySelector<HTMLInputElement>("#username")!.value = usernameInit;
      toggleEditMode();
    },
  });

  buttonContainer.appendChild(modifyButton);

  function valideModif() {
    const emailInput = modal.querySelector<HTMLInputElement>("#email")!;
    const usernameInput = modal.querySelector<HTMLInputElement>("#username")!;
    authStorage.setUserValue("email", emailInput.value);
    authStorage.setUserValue("username", usernameInput.value);
    toggleEditMode();
    navigateTo("home");
  }

  function toggleEditMode() {
    isEditing = !isEditing;
    const emailInput = modal.querySelector<HTMLInputElement>("#email")!;
    const usernameInput = modal.querySelector<HTMLInputElement>("#username")!;
    const passwordInput = modal.querySelector<HTMLInputElement>("#password")!;
    const toggleEye =
      modal.querySelector<HTMLImageElement>("#toggle-password")!;

    emailInput.readOnly = !isEditing;
    usernameInput.readOnly = !isEditing;
    toggleEye.style.display = isEditing ? "none" : "block";

    passwordInput.type = "password";
    passwordInput.value = "*******";

    buttonContainer.innerHTML = "";
    if (isEditing) {
      buttonContainer.appendChild(validateButton);
      buttonContainer.appendChild(cancelButton);
    } else {
      buttonContainer.appendChild(modifyButton);
    }
  }

  const A2FButtonAEnable = createCustomButton({
    text: "Activer A2F",
    height: "60px",
    fontSizeClass: "text-2xl",
    fontStyle: "font-jaro",
    backgroundColor: "bg-green-500",
    position: "absolute top-106 right-10",
    padding: "p-[10px]",
    onClick: () => EnableDisableA2F(),
  });

  const A2FButtonDisable = createCustomButton({
    text: "Desactiver A2F",
    height: "60px",
    fontSizeClass: "text-2xl",
    fontStyle: "font-jaro",
    backgroundColor: "bg-red-500",
    position: "absolute top-106 right-10",
    padding: "p-[10px]",
    onClick: () => EnableDisableA2F(),
  });

  if (!authStorage.getA2F()) {
    modalContainer.appendChild(A2FButtonAEnable);
  } else {
    modalContainer.appendChild(A2FButtonDisable);
  }

    const LogoutButton = createCustomButton({
    text: "Déconnexion",
    height: "60px",
    fontSizeClass: "text-2xl",
    fontStyle: "font-jaro",
    backgroundColor: "bg-red-500",
    position: "absolute top-127 right-10",
    padding: "p-[10px]",
    onClick: () => {
      authStorage.clearAuth(),
      navigateTo("home"),
      modal.remove()
    },
  });

    modalContainer.appendChild(LogoutButton);

  navigateTo("home");
}
