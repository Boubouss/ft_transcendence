import { createAccountModal } from "./AccountModal";
import { createAccountMobilePage } from "./AccountMobilePage";
import * as authStorage from "@utils/authStorage";
import { createCustomButton } from "@/components/Buttons/CustomButton";
import { navigateTo } from "@/router";
import { EnableDisableA2F } from "@pages/Sign/A2F";
import { t } from "@utils/i18n";
import * as accmobile from "@pages/Account/AccountMobilePage"

export function renderAccount() {
  const isMobile = window.innerWidth < 640;
  isMobile ? accmobile.renderMobileAccountPage() : renderDesktopAccountModal();
}

// ----- DESKTOP -----
export function renderDesktopAccountModal() {
  const existing = document.getElementById("account-modal");
  if (existing) existing.remove();

  const modal = createAccountModal();
  document.body.appendChild(modal);
  const modalContainer = modal.querySelector(".relative") as HTMLElement;

  modalContainer.addEventListener("click", (e) => e.stopPropagation());

  addCloseButton(modal, modalContainer);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  const emailInput = modal.querySelector<HTMLInputElement>("#email")!;
  const usernameInput = modal.querySelector<HTMLInputElement>("#username")!;
  const oldPasswordInput = modal.querySelector<HTMLInputElement>("#password")!;
  const newPasswordInput = modal.querySelector<HTMLInputElement>("#new-password")!;
  const newPasswordContainer = modal.querySelector<HTMLDivElement>("#new-password-container")!;
  const buttonContainer = modal.querySelector<HTMLDivElement>("#button-container")!;

  const emailInit = authStorage.getUserValue("email");
  const usernameInit = authStorage.getUserValue("username");

  let isEditing = false;

  const modifyButton = createModifyButton(() => {
    isEditing = toggleEditMode(
      isEditing,
      emailInput,
      usernameInput,
      oldPasswordInput,
      newPasswordInput,
      newPasswordContainer,
      buttonContainer,
      modifyButton,
      validateButton,
      cancelButton
    );
  });

  const validateButton = createValidateButton(() => {
    validateAccountEdit(emailInput, usernameInput);
    isEditing = toggleEditMode(
      isEditing,
      emailInput,
      usernameInput,
      oldPasswordInput,
      newPasswordInput,
      newPasswordContainer,
      buttonContainer,
      modifyButton,
      validateButton,
      cancelButton
    );
  });

  const cancelButton = createCancelButton(() => {
    emailInput.value = emailInit;
    usernameInput.value = usernameInit;
    oldPasswordInput.value = "";
    newPasswordInput.value = "";
    isEditing = toggleEditMode(
      isEditing,
      emailInput,
      usernameInput,
      oldPasswordInput,
      newPasswordInput,
      newPasswordContainer,
      buttonContainer,
      modifyButton,
      validateButton,
      cancelButton
    );
  });

  buttonContainer.appendChild(modifyButton);

  modalContainer.appendChild(createA2FButton());
  modalContainer.appendChild(createLogoutButton(modal));
  modalContainer.appendChild(createAvatarButton(modalContainer));

  navigateTo("home");
}

export function toggleEditMode(
  isEditing: boolean,
  emailInput: HTMLInputElement,
  usernameInput: HTMLInputElement,
  oldPasswordInput: HTMLInputElement,
  newPasswordInput: HTMLInputElement,
  newPasswordContainer: HTMLDivElement,
  buttonContainer: HTMLDivElement,
  modifyButton: HTMLElement,
  validateButton: HTMLElement,
  cancelButton: HTMLElement
): boolean {
  if (isEditing) {
    // Désactiver l'édition
    emailInput.readOnly = true;
    usernameInput.readOnly = true;
    oldPasswordInput.readOnly = true;
    oldPasswordInput.value = "******";
    oldPasswordInput.placeholder = t("password");
    newPasswordInput.value = "";
    newPasswordContainer.style.display = "none";

    buttonContainer.innerHTML = "";
    buttonContainer.style.display = "flex";
    buttonContainer.style.flexDirection = "column";
    buttonContainer.appendChild(modifyButton);

    return false;
  } else {
    // Activer l'édition
    emailInput.readOnly = false;
    usernameInput.readOnly = false;
    oldPasswordInput.readOnly = false;
    oldPasswordInput.value = "";
    oldPasswordInput.placeholder = t("oldpw");
    newPasswordInput.value = "";
    newPasswordInput.placeholder = t("newpw");
    newPasswordContainer.style.display = "flex";

    buttonContainer.innerHTML = "";
    Object.assign(buttonContainer.style, {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      gap: "10px",
    });
    buttonContainer.appendChild(validateButton);
    buttonContainer.appendChild(cancelButton);


    return true;
  }
}

export function validateAccountEdit(
  emailInput: HTMLInputElement,
  usernameInput: HTMLInputElement
) {
  authStorage.setUserValue("email", emailInput.value);
  authStorage.setUserValue("username", usernameInput.value);
  navigateTo("home");
}


// ----- BOUTONS -----
export function addCloseButton(modal: HTMLElement, container: HTMLElement) {
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
  container.appendChild(closeButton);
}

export function createModifyButton(onClick: () => void) {
  return createCustomButton({
    height: "50px",
    borderRadius: "rounded-[20px]",
    text: t("editinfo"),
    fontSizeClass: "text-2xl",
    padding: "p-[10px]",
    onClick,
  });
}

export function createValidateButton(onClick: () => void) {
  return createCustomButton({
    width: "120px",
    height: "50px",
    borderRadius: "rounded-[20px]",
    text: t("valid"),
    onClick,
  });
}

export function createCancelButton(onClick: () => void) {
  return createCustomButton({
    width: "120px",
    height: "50px",
    borderRadius: "rounded-[20px]",
    text: t("cancel"),
    onClick: () => {},
  });
}

export function createA2FButton() {
  const isMobile = innerWidth <= 640;
  return createCustomButton({
    text: authStorage.getA2F() ? t("offa2f") : t("ona2f"),
    height: "60px",
    fontSizeClass: "text-2xl",
    fontStyle: "font-jaro",
    backgroundColor: authStorage.getA2F() ? "bg-red-500" : "bg-green-500",
    padding: "p-[10px]",
    position: "absolute top-[230px] right-10 sm:top-[340px]", // ✅ position via Tailwind
    onClick: () => EnableDisableA2F(),
  });
}


export function createLogoutButton(modal: HTMLElement) {
  return createCustomButton({
    text: t("disco"),
    height: "60px",
    fontSizeClass: "text-2xl",
    fontStyle: "font-jaro",
    backgroundColor: "bg-red-500",
    position: "absolute top-110 right-10",
    padding: "p-[10px]",
    onClick: () => {
      authStorage.clearAuth();
      navigateTo("home");
      modal.remove();
    },
  });
}

export function createAvatarButton(container: HTMLElement) {
  const AvatarButton = createCustomButton({
    height: "160px",
    width: "160px",
    fontSizeClass: "text-2xl",
    fontStyle: "font-jaro",
    borderRadius: "rounded-full",
    backgroundColor: "bg-transparent",
    position: "absolute sm:top-[120px] sm:left-[500px] top-[190px] left-[80px]",
    padding: "p-[10px]",
    onClick: () => fileInput.click(),
    onHover: () => (hoverImage.style.display = "block"),
    onLeave: () => (hoverImage.style.display = "none"),
  });

  const hoverImage = document.createElement("img");
  hoverImage.src = "/assets/icons/modif_avatar_white.png";
  hoverImage.alt = "Modifier l’avatar";
  Object.assign(hoverImage.style, {
    width: "85px",
    height: "85px",
    objectFit: "contain",
    display: "none",
  });
  AvatarButton.appendChild(hoverImage);

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.style.display = "none";
  container.appendChild(fileInput);

  fileInput.addEventListener("change", (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      AvatarButton.innerHTML = "";
      const avatarImg = document.createElement("img");
      Object.assign(avatarImg.style, {
        width: "100%",
        height: "100%",
        objectFit: "cover",
      });
      avatarImg.src = imageUrl;
      AvatarButton.appendChild(avatarImg);
      AvatarButton.appendChild(hoverImage);
      authStorage.setUserValue("avatar", imageUrl);
    };
    reader.readAsDataURL(file);
  });

  return AvatarButton;
}
