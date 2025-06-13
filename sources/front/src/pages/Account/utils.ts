import * as authStorage from "@utils/authStorage";
import * as accbutton from "@components/Buttons/AccountButtons";
import { t } from "@/utils/i18n";
import { navigateTo } from "@/router";
import { editUser } from "@/utils/db_utils";

export function initializeAccountContent(container: HTMLElement) {
  const emailInput = container.querySelector<HTMLInputElement>("#email")!;
  const nameInput = container.querySelector<HTMLInputElement>("#username")!;
  const oldPasswordInput =
    container.querySelector<HTMLInputElement>("#password")!;
  const newPasswordContainer = container.querySelector<HTMLDivElement>(
    "#new-password-container"
  )!;
  const newPasswordInput =
    container.querySelector<HTMLInputElement>("#new-password")!;
  const buttonContainer =
    container.querySelector<HTMLDivElement>("#button-container")!;

  const emailInit = authStorage.getUserValue("email");
  const usernameInit = authStorage.getUserValue("name");

  return {
    emailInput,
    nameInput,
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
  isModal: boolean,
  updateAvatarLayout?: (overrideIsEdit?: boolean) => void
) {
  let isEditing = false;

  const toggleEditMode = () => {
    isEditing = !isEditing;

    const {
      emailInput,
      nameInput,
      oldPasswordInput,
      newPasswordContainer,
      newPasswordInput,
      buttonContainer,
      emailInit,
      usernameInit,
    } = elements;

    emailInput.readOnly = !isEditing;
    nameInput.readOnly = !isEditing;

    // Montre les boutons A2F + Avatar dans les bons conteneurs
    const sideButtonsContainer = document.querySelector(
      "#side-buttons"
    ) as HTMLElement;
    const mobileEditButtons = document.querySelector(
      "#mobile-edit-buttons"
    ) as HTMLElement;

    if (isModal) {
      if (sideButtonsContainer) {
        sideButtonsContainer.style.display = isEditing ? "flex" : "none";
      }
      // Logout uniquement si isModal (desktop)
    } else {
      if (mobileEditButtons) {
        mobileEditButtons.style.display = isEditing ? "flex" : "none";
      }
    }

    if (isEditing) {
      authStorage.saveOld2fa(authStorage.getA2FfromConfig());

      oldPasswordInput.readOnly = false;
      oldPasswordInput.value = "";
      oldPasswordInput.placeholder = t("oldpw");
      newPasswordContainer.style.display = "flex";
      newPasswordInput.value = "";

      buttonContainer.innerHTML = "";
      buttonContainer.style.display = "flex";
      buttonContainer.style.gap = "12px";
      buttonContainer.style.justifyContent = "center";

      mobileEditButtons.classList.remove("flex-col");
      mobileEditButtons.classList.add("flex-row", "justify-center");

      buttonContainer.appendChild(
        accbutton.createValidateEditButton(async () => {
          if (updateAvatarLayout !== undefined) updateAvatarLayout(false);

          await editUser(nameInput.value, emailInput.value);

          toggleEditMode();
          //authStorage.setUserValue("email", emailInput.value);
          //authStorage.setUserValue("name", nameInput.value);
          authStorage.clearOld2fa();
          navigateTo("account");
        })
      );
      buttonContainer.appendChild(
        accbutton.createCancelEditButton(() => {
          emailInput.value = emailInit !== null ? emailInit : "";
          nameInput.value = usernameInit !== null ? usernameInit : "";

          oldPasswordInput.value = "";
          newPasswordInput.value = "";
          if (updateAvatarLayout !== undefined) updateAvatarLayout(false);

          if (authStorage.getA2FfromConfig() != null)
            authStorage.getSignificant2FA()
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

      buttonContainer.appendChild(
        accbutton.createEditInfoButton(toggleEditMode)
      );

      mobileEditButtons.classList.remove("flex-row", "justify-center");
      mobileEditButtons.classList.add("flex-col");
    }
  };

  return toggleEditMode;
}
