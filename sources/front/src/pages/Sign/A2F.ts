import { navigateTo } from "@/router";
import * as authStorage from "@utils/authStorage.ts";
import { createCustomButton } from "@/components/Buttons/CustomButton"; // adapte le chemin si besoin
import { t } from "@utils/i18n";
import type { User_T } from "@utils/authStorage.ts";

function create2FAModal(validOrActivate: string, user: User_T): HTMLDivElement {
  const modal = document.createElement("div");
  modal.id = "twofa-modal";
  modal.style.backgroundColor = "rgba(0,0,0,0.5)";

  modal.className = `
  fixed
  top-0
  left-0
  w-full
  h-full
  flex
  justify-center
  items-center
  `;
  modal.style.fontStyle = "font-jaro";


  const modalContent = document.createElement("div");
  modalContent.className = `
   bg-orange-400
   p-[20px]
   rounded-[20px]
   max-w-[320px]
   w-[90%]
   text-center
   border-2
   border-black
   `;


  const title = document.createElement("p");
  title.textContent = t("sentto") + authStorage.getUserValue("email");
  title.className = `whitespace-pre-line font-jaro`;


  const input = document.createElement("input");
  input.id = "twofa-code";
  input.type = "text";
  input.maxLength = 6;
  input.placeholder = t("entera2f");
  input.style.margin = "15px 0";
  input.style.letterSpacing = "0.3em";

  input.className = `
  w-full
  p-[10px]
  text-[16px]
  text-center
  border-2
  rounded-[15px]
  bg-[#FFFFFF99]
  focus:outline-none
  `;

  const buttonsContainer = document.createElement("div");
  buttonsContainer.style.display = "flex";
  buttonsContainer.style.flexDirection = "column";
  buttonsContainer.style.alignItems = "center";
  buttonsContainer.style.gap = "10px";

  const submitBtn = createCustomButton({
    text: t("valid"),
    backgroundColor: "bg-green-500",
    textColor: "text-white",
    width: "50%",
    borderRadius: "rounded-[10px]",
    fontSizeClass: "text-base",
    fontStyle: "font-jaro",
    onClick: () => {
      const code = input.value.trim();
      if (code !== "000000") {
        alert(t("alerta2f"));
        return;
      }
      document.body.removeChild(modal);
      if (validOrActivate == "EnableDisable") {
        // Activation / désactivation 2FA
        const A2FStatus = authStorage.getA2FfromConfig();
        authStorage.setA2FInConfig(!A2FStatus);
        if (authStorage.getA2FfromConfig()) {
          alert(t("a2fenable"))
        } else {
          alert(t("a2fdisable"))
        }
      } else {
        authStorage.saveUser(user);

        const token = authStorage.getUserValue("token");
        if (token)
          authStorage.saveToken(token);
          navigateTo("home");
      }
    },
  });

  const closeBtn = createCustomButton({
    text: t("cancel"),
    backgroundColor: "bg-red-500",
    textColor: "text-white",
    width: "50%",
    borderRadius: "rounded-[10px]",
    fontSizeClass: "text-base",
    fontStyle: "font-jaro",
    onClick: () => {
      const modal = document.querySelector("#twofa-modal");
      if (modal) document.body.removeChild(modal);
      if (validOrActivate == "Connexion")
        authStorage.clearAuth();
    },
  });

  buttonsContainer.appendChild(submitBtn);
  buttonsContainer.appendChild(closeBtn);

  modalContent.appendChild(title);
  modalContent.appendChild(input);
  modalContent.appendChild(buttonsContainer);
  modal.appendChild(modalContent);

  return modal;
}

function show2FAModal(validOrActivate: string, user: User_T) {
  const modal = create2FAModal(validOrActivate, user);
  document.body.appendChild(modal);
}

export function handlePostLogin(user: User_T, needs2FA: boolean) {
  if (!needs2FA) {
    navigateTo("home");
  } else {
    show2FAModal('Connexion', user); // validation mode
  }
}

export async function EnableDisableA2F(): Promise<void> {
  const user: User_T | null = authStorage.getUser();
  if (!user) {
    alert("User Issue");
    return;
  }

  // Après, si elle montre une modale, elle doit être attendue :
  await show2FAModal("EnableDisable", user);
}

