import * as authStorage from "@utils/authStorage"
import * as accbutton from "@components/Buttons/AccountButtons"
import { t } from "@/utils/i18n";

export function initializeAccountContent(container: HTMLElement) {

  const emailInput = container.querySelector<HTMLInputElement>("#email")!;
  const usernameInput = container.querySelector<HTMLInputElement>("#username")!;
  const oldPasswordInput = container.querySelector<HTMLInputElement>("#password")!;
  const newPasswordContainer = container.querySelector<HTMLDivElement>("#new-password-container")!;
  const newPasswordInput = container.querySelector<HTMLInputElement>("#new-password")!;
  const buttonContainer = container.querySelector<HTMLDivElement>("#button-container")!;

  const emailInit = authStorage.getUserValue("email");
  const usernameInit = authStorage.getUserValue("name");

  return {
    emailInput,
    usernameInput,
    oldPasswordInput,
    newPasswordContainer,
    newPasswordInput,
    buttonContainer,
    emailInit,
    usernameInit,
  };
}

export function createToggleEditMode(
  elements: ReturnType<typeof initializeAccountContent>,
  navigateTo: (page: string) => void,
  a2fButton: HTMLElement,
  avatarButton: HTMLElement,
  logoutButton: HTMLElement,
  isModal: boolean
) {
  let isEditing = false;

  const toggleEditMode = () => {
    isEditing = !isEditing;

    const {
      emailInput,
      usernameInput,
      oldPasswordInput,
      newPasswordContainer,
      newPasswordInput,
      buttonContainer,
      emailInit,
      usernameInit,
    } = elements;

    emailInput.readOnly = !isEditing;
    usernameInput.readOnly = !isEditing;

    // Affiche ou cache les boutons A2F et Logout
    a2fButton.style.display = isEditing ? "none" : "flex";
    if (isModal !== false)
      logoutButton.style.display = isEditing ? "none" : "flex";
    avatarButton.style.display = isEditing ? "flex" : "none";


    if (isEditing) {

      oldPasswordInput.readOnly = false;
      oldPasswordInput.value = "";
      oldPasswordInput.placeholder = t("oldpw");
      newPasswordContainer.style.display = "flex";
      newPasswordInput.value = "";

      buttonContainer.innerHTML = "";
      buttonContainer.style.display = "flex";
      buttonContainer.style.gap = "12px";
      buttonContainer.style.justifyContent = "center";

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
      buttonContainer.style.display = "";
      buttonContainer.style.gap = "";
      buttonContainer.style.justifyContent = "";

      buttonContainer.appendChild(accbutton.createEditInfoButton(toggleEditMode));
    }
  };

  return toggleEditMode;
}

