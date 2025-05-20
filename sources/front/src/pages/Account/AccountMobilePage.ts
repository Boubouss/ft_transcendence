import { createCustomButton } from "@/components/Buttons/CustomButton";
import * as authStorage from "@utils/authStorage";
import { t } from "@utils/i18n";
import { EnableDisableA2F } from "@pages/Sign/A2F";
import { navigateTo } from "@/router";
import * as AccModalSystem from "@pages/Account/AccountModalSystem";

export function createAccountMobilePage(): HTMLElement {
  const container = document.createElement("div");
  const username = authStorage.getUserValue("username");
  const email = authStorage.getUserValue("email");
  const avatarUrl =
    authStorage.getUserValue("avatar") || "/assets/icons/default_avatar.png";

  const settings = t("settings");
  const accountinfo = t("accountinfo");
  const username_tag = t("username");
  const pw = t("pw");
  const oldpw = t("oldpw");
  const newpw = t("newpw");

  container.className =
    "flex flex-col items-center px-4 py-6 gap-6 w-full min-h-screen bg-orange-500";
  container.style = "font-family: 'Jaro', sans-serif";

  container.innerHTML = `
    <h2 class="text-5xl font-jaro text-black">${settings}</h2>
    <div class="w-full h-[3px] bg-black"></div>

    <div class="flex flex-col items-center gap-4 w-full">
      <div class="text-3xl font-jaro text-center bg-[#FFFFFF99] px-4 py-2 rounded-2xl border-2 border-black w-full max-w-[400px]">
        ${accountinfo}
      </div>

     <div class="w-40 h-40 rounded-full overflow-hidden border-2 border-black bg-[#FFFFFF99]">
  <img src="${avatarUrl}" alt="Avatar" class="w-full h-full object-cover" style="transform: scale(1.2);" />
</div>


      <div class="flex flex-col gap-4 w-full max-w-[400px]">
        <div class="bg-[#FFFFFF99] rounded-[20px] border-2 border-black px-4 py-3 flex items-center justify-between">
          <label for="email" class="text-black text-xl font-jaro">Email :</label>
          <input id="email" type="text" readonly value="${email}" class="bg-transparent text-black text-xl font-jaro text-right w-[60%] focus:outline-none" />
        </div>

        <div class="bg-[#FFFFFF99] rounded-[20px] border-2 border-black px-4 py-3 flex items-center justify-between">
          <label for="username" class="text-black text-xl font-jaro">${username_tag} :</label>
          <input id="username" type="text" readonly value="${username}" class="bg-transparent text-black text-xl font-jaro text-right w-[60%] focus:outline-none" />
        </div>

        <div class="bg-[#FFFFFF99] rounded-[20px] border-2 border-black px-4 py-3 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <label for="password" class="text-black text-xl font-jaro">${pw} :</label>
            <input id="password" type="password" readonly value="******" class="bg-transparent text-black text-xl font-jaro w-[60%] text-right focus:outline-none" />
          </div>
          <div id="new-password-container" class="flex items-center justify-between hidden">
            <label for="new-password" class="text-black text-xl font-jaro">${newpw} :</label>
            <input id="new-password" type="password" value="" class="bg-transparent text-black text-xl font-jaro w-[60%] text-right focus:outline-none" />
          </div>
        </div>
      </div>
    </div>

    <div id="button-container" class="flex flex-col gap-3 mt-6 w-full max-w-[400px]"></div>
  `;

  return container;
}

export function renderMobileAccountPage() {
  const menuModal = document.getElementById("menu-modal");
  if (menuModal) {
    menuModal.style.transform = "translateX(100%)";
    setTimeout(() => menuModal.remove(), 300);
  }
  const container = document.getElementById("app-root")!;
  container.innerHTML = "";
  container.appendChild(createAccountMobilePage());

  const emailInput = container.querySelector<HTMLInputElement>("#email")!;
  const usernameInput = container.querySelector<HTMLInputElement>("#username")!;
  const oldPasswordInput =
    container.querySelector<HTMLInputElement>("#password")!;
  const newPasswordInput =
    container.querySelector<HTMLInputElement>("#new-password")!;
  const newPasswordContainer = container.querySelector<HTMLDivElement>(
    "#new-password-container"
  )!;
  const buttonContainer =
    container.querySelector<HTMLDivElement>("#button-container")!;

  const emailInit = authStorage.getUserValue("email");
  const usernameInit = authStorage.getUserValue("username");

  let isEditing = false;

  const modifyButton = AccModalSystem.createModifyButton(() => {
    isEditing = AccModalSystem.toggleEditMode(
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

  const validateButton = AccModalSystem.createValidateButton(() => {
    AccModalSystem.validateAccountEdit(emailInput, usernameInput);
    isEditing = AccModalSystem.toggleEditMode(
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

  const cancelButton = AccModalSystem.createCancelButton(() => {
    emailInput.value = emailInit;
    usernameInput.value = usernameInit;
    oldPasswordInput.value = "";
    newPasswordInput.value = "";
    isEditing = AccModalSystem.toggleEditMode(
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

  const a2fButton = AccModalSystem.createA2FButton();
  a2fButton.style.marginTop = "auto";

  buttonContainer.appendChild(a2fButton);
  buttonContainer.appendChild(AccModalSystem.createLogoutButton(container));
  buttonContainer.appendChild(
    AccModalSystem.createAvatarButton(buttonContainer)
  );
}
