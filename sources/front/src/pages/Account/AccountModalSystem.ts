// AccountModalSystem.ts
import { createAccountModal } from "./AccountModal";
import * as authStorage from "@utils/authStorage";
import { createCustomButton } from "@/components/Buttons/CustomButton";
import { navigateTo } from "@/router";
import { EnableDisableA2F } from "@pages/Sign/A2F";
import { t } from "@utils/i18n";

export function renderAccount() {
  // Supprimer modal existant si besoin
  const existing = document.getElementById("account-modal");
  if (existing) existing.remove();

  // Créer nouveau modal
  const modal = createAccountModal();
  document.body.appendChild(modal);

  const modalContainer = modal.querySelector(".relative")!;
  modalContainer.addEventListener("click", (e) => e.stopPropagation());

  // Bouton fermer
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

  // Clic en dehors ferme modal
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  // Références aux inputs
  const emailInput = modal.querySelector<HTMLInputElement>("#email")!;
  const usernameInput = modal.querySelector<HTMLInputElement>("#username")!;
  const oldPasswordInput = modal.querySelector<HTMLInputElement>("#password")!;
  const newPasswordContainer = modal.querySelector<HTMLDivElement>("#new-password-container")!;
  const newPasswordInput = modal.querySelector<HTMLInputElement>("#new-password")!;

  // Bouton container
  const buttonContainer = modal.querySelector<HTMLDivElement>("#button-container")!;

  // Valeurs initiales
  const emailInit = authStorage.getUserValue("email");
  const usernameInit = authStorage.getUserValue("username");

  let isEditing = false;

  // Boutons
  const modifyButton = createCustomButton({
    height: "50px",
    borderRadius: "rounded-[20px]",
    text: t("editinfo"),
    fontSizeClass: "text-2xl",
    padding: "p-[10px]",
    onClick: () => toggleEditMode(),
  });

  const validateButton = createCustomButton({
    width: "120px",
    height: "50px",
    borderRadius: "rounded-[20px]",
    text: t("valid"),
    onClick: () => valideModif(),
  });

  const cancelButton = createCustomButton({
    width: "120px",
    height: "50px",
    borderRadius: "rounded-[20px]",
    text: t("cancel"),
    onClick: () => {
      emailInput.value = emailInit;
      usernameInput.value = usernameInit;
      oldPasswordInput.value = "";
      newPasswordInput.value = "";
      toggleEditMode();
    },
  });

  // Initial : bouton modifier
  buttonContainer.appendChild(modifyButton);

  function toggleEditMode() {
    isEditing = !isEditing;

    emailInput.readOnly = !isEditing;
    usernameInput.readOnly = !isEditing;

    if (isEditing) {
      // Mode édition
      oldPasswordInput.readOnly = false;
      oldPasswordInput.value = "";
      oldPasswordInput.placeholder = t("oldpw");

      newPasswordContainer.style.display = "flex";
      newPasswordInput.value = "";
      newPasswordInput.placeholder = t("newpw");


      // Remplace les boutons
      buttonContainer.innerHTML = "";
      buttonContainer.style.display = "flex";
      buttonContainer.style.flexDirection = "row";
      buttonContainer.style.justifyContent = "center";
      buttonContainer.style.gap = "10px";

      buttonContainer.appendChild(validateButton);
      buttonContainer.appendChild(cancelButton);
    } else {
      // Mode lecture seule
      oldPasswordInput.readOnly = true;
      oldPasswordInput.value = "******";
      oldPasswordInput.placeholder = t("password");

      newPasswordContainer.style.display = "none";
      newPasswordInput.value = "";

      buttonContainer.innerHTML = "";
      buttonContainer.style.display = "flex";
      buttonContainer.style.flexDirection = "column";
      buttonContainer.appendChild(modifyButton);
    }
  }

  function valideModif() {
    const oldPass = oldPasswordInput.value.trim();
    const newPass = newPasswordInput.value.trim();

    if (oldPass.length === 0 || newPass.length === 0) {
      alert(t("alertoldnew"));
      return;
    }


    // On sauve les nouvelles valeurs
    authStorage.setUserValue("email", emailInput.value);
    authStorage.setUserValue("username", usernameInput.value);
    //authStorage.setUserValue("password", newPass);

    toggleEditMode();
    navigateTo("home");
  }

  // Boutons A2F (2FA)
  const A2FButtonEnable = createCustomButton({
    text: t("ona2f"),
    height: "60px",
    fontSizeClass: "text-2xl",
    fontStyle: "font-jaro",
    backgroundColor: "bg-green-500",
    position: "absolute top-106 right-10",
    padding: "p-[10px]",
    onClick: () => EnableDisableA2F(),
  });

  const A2FButtonDisable = createCustomButton({
    text: t("offa2f"),
    height: "60px",
    fontSizeClass: "text-2xl",
    fontStyle: "font-jaro",
    backgroundColor: "bg-red-500",
    position: "absolute top-106 right-10",
    padding: "p-[10px]",
    onClick: () => EnableDisableA2F(),
  });

  if (!authStorage.getA2F()) {
    modalContainer.appendChild(A2FButtonEnable);
  } else {
    modalContainer.appendChild(A2FButtonDisable);
  }

  // Bouton déconnexion
  const logoutButton = createCustomButton({
    text: t("disco"),
    height: "60px",
    fontSizeClass: "text-2xl",
    fontStyle: "font-jaro",
    backgroundColor: "bg-red-500",
    position: "absolute top-127 right-10",
    padding: "p-[10px]",
    onClick: () => {
      authStorage.clearAuth();
      navigateTo("home");
      modal.remove();
    },
  });

  modalContainer.appendChild(logoutButton);

  // Affiche la page "home" au chargement du modal
  navigateTo("home");
}
