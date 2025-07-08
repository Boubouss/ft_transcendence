import * as authStorage from "@utils/authStorage";
import * as accbutton from "@components/Buttons/AccountButtons";
import { t } from "@/utils/i18n";
import { navigateTo } from "@/router";
import { editUser } from "@/utils/db_utils";

export function initializeAccountContent(container: HTMLElement) {
  const emailInput = container.querySelector<HTMLInputElement>("#email")!;
  const nameInput = container.querySelector<HTMLInputElement>("#username")!;
  const PasswordInput =
    container.querySelector<HTMLInputElement>("#password")!;
  const buttonContainer =
    container.querySelector<HTMLDivElement>("#button-container")!;
  const buttonEyes = container.querySelector<HTMLDivElement>("#button-eyes")!;

  const emailInit = authStorage.getUserValue("email");
  const usernameInit = authStorage.getUserValue("name");

  return {
    emailInput,
    nameInput,
    PasswordInput,
    buttonContainer,
    emailInit,
    buttonEyes,
    usernameInit,
  };
}

export function createToggleEditMode(
  elements: ReturnType<typeof initializeAccountContent>,
  updateAvatarLayout?: (overrideIsEdit?: boolean) => void
) {
  let isEditing = false;

  const toggleEditMode = () => {
    isEditing = !isEditing;

    const {
      emailInput,
      nameInput,
      PasswordInput,
      buttonContainer,
      emailInit,
      buttonEyes,
      usernameInit,
    } = elements;

    emailInput.readOnly = !isEditing;
    nameInput.readOnly = !isEditing;

    // Montre les boutons A2F + Avatar dans les bons conteneurs

    const mobileEditButtons = document.querySelector(
      "#mobile-edit-buttons"
    ) as HTMLElement;

    if (mobileEditButtons) {
        mobileEditButtons.style.display = isEditing ? "flex" : "none";
      }

    if (isEditing) {
      authStorage.saveOld2fa(authStorage.getA2FfromConfig());

      buttonEyes.classList.remove("hidden");

      PasswordInput.readOnly = false;
      PasswordInput.value = "";
      PasswordInput.placeholder = t("newpw");
      PasswordInput.classList.replace("w-[60%]", "w-[55%]")

      buttonContainer.innerHTML = "";
      buttonContainer.style.display = "flex";
      buttonContainer.style.gap = "12px";
      buttonContainer.style.justifyContent = "center";

      mobileEditButtons.classList.remove("flex-col");
      mobileEditButtons.classList.add("flex-row", "justify-center");

      buttonContainer.appendChild(
        accbutton.createValidateEditButton(async () => {
          if (updateAvatarLayout !== undefined) updateAvatarLayout(false);

          await editUser(nameInput.value, emailInput.value, PasswordInput.value);

          toggleEditMode();
          authStorage.clearOld2fa();
          navigateTo("/account");
        })
      );
      buttonContainer.appendChild(
        accbutton.createCancelEditButton(() => {
          emailInput.value = emailInit !== null ? emailInit : "";
          nameInput.value = usernameInit !== null ? usernameInit : "";

          PasswordInput.value = "";

          if (authStorage.getA2FfromConfig() != null)
            authStorage.getSignificant2FA()
           toggleEditMode();
        })
      );
    } else {

      buttonEyes.classList.add("hidden");


      PasswordInput.readOnly = true;
      PasswordInput.value = "******";

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
