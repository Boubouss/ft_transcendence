import * as authStorage from "@utils/authStorage";
import { t } from "@utils/i18n";

export function createAccountPage(isModal = false): HTMLElement {
  const container = document.createElement("div");
  const username = authStorage.getUserValue("name");
  const email = authStorage.getUserValue("email");
  const avatarUrl =
    authStorage.getUserValue("avatar") || "/assets/icons/default_avatar.png";

  const settings = t("settings");
  const accountinfo = t("accountinfo");
  const username_tag = t("username");
  const pw = t("pw");

  container.className =
    "relative flex flex-col items-center px-4 py-6 gap-6 w-full min-h-screen bg-orange-400";
  container.style.fontFamily = "'Jaro', sans-serif";

  if (isModal) {
    container.classList.remove("min-h-screen");
    container.classList.add(
      "rounded-2xl",
      "p-6",
      "max-h-[90vh]",
      "overflow-y-auto",
      "w-[90vw]",
      "max-w-[600px]",
      "border-2",
      "border-black"
    );
  }

  container.innerHTML = `

    <h2 class="text-4xl md:text-6xl font-jaro text-black text-center">${settings}</h2>
    <div class="w-full h-1 bg-black"></div>


    <div class="flex flex-col items-center gap-4 w-full">
      <div class="text-2xl md:text-3xl font-jaro text-center bg-[#FFFFFF99] px-4 py-2 rounded-2xl border-2 border-black w-full max-w-[400px]">
        ${accountinfo}
      </div>

      <div id="avatar-section" class="justify-center flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full max-w-[400px] p-2">
        <div id="avatar-wrapper" class="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-black bg-[#FFFFFF99]">
          <img src="${avatarUrl}" alt="Avatar" class="w-full h-full object-cover" style="transform: scale(1.2);" />
        </div>
      </div>

      <div class="flex flex-col gap-4 w-full max-w-[400px]">
        <div class="bg-[#FFFFFF99] rounded-[20px] border-2 border-black px-4 py-3 flex items-center justify-between">
          <label for="email" class="text-black text-base md:text-xl font-jaro">Email :</label>
          <input id="email" type="text" readonly value="${email}" class="bg-transparent text-black text-base md:text-xl font-jaro text-right w-[60%] focus:outline-none" />
        </div>

        <div class="bg-[#FFFFFF99] rounded-[20px] border-2 border-black px-4 py-3 flex items-center justify-between">
          <label for="username" class="text-black text-base md:text-xl font-jaro">${username_tag}: </label>
          <input id="username" type="text" readonly value="${username}" class="bg-transparent text-black text-base md:text-xl font-jaro text-right w-[50%] focus:outline-none" />
        </div>

        <div class="bg-[#FFFFFF99] rounded-[20px] border-2 border-black px-4 py-3 flex flex-col gap-3 ">
          <div class="flex items-center justify-between">
            <label for="password" class="text-black text-base md:text-xl font-jaro min-w-[35%]">${pw} :</label>
            <input id="password" type="password" readonly value="******" class="bg-transparent text-black text-base md:text-xl font-jaro w-full text-right focus:outline-none" />
          <div id="button-eyes" class="hidden pl-3"></div>
        </div>
        </div>

      <!-- Conteneur des boutons A2F et avatar pour mobile (à rendre visible dynamiquement) -->
      <div id="mobile-edit-buttons" class="flex sm:hidden flex-col gap-2 w-full max-w-[400px] mt-3" style="display: none;"></div>

      <!-- Conteneur principal des actions (edit/valider/annuler) -->
      <div id="button-container" class="flex flex-row justify-center items-center gap-4 w-full max-w-[400px] mt-1"></div>
    </div>
  `;

  return container;
}
