import { navigateTo } from "../../router";
import * as authStorage from "../../utils/authStorage.ts";

export function handlePostLogin(user: any, needs2FA: boolean) {
  if (!needs2FA) {
    // Stocke le token & user dans localStorage puis redirige
    authStorage.saveToken(user.token);
    authStorage.saveUser(user);
  } else {
    // Affiche le modal 2FA
    show2FAModal(user);
  }
}

export async function EnableDisableA2F() {
  const user = authStorage.getUser();
  const modal = create2FAModal();
  document.body.appendChild(modal);
  await handle2FActivation(user, modal);
  navigateTo("account");
}

function create2FAModal(): HTMLDivElement {
  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100vw";
  modal.style.height = "100vh";
  modal.style.backgroundColor = "rgba(0,0,0,0.5)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "1000";

  modal.innerHTML = `
    <div style="background: white; padding: 20px; border-radius: 8px; max-width: 320px; width: 90%; text-align: center;">
      <h3>Code 2FA requis</h3>
      <input id="twofa-code" type="text" maxlength="6" placeholder="Entrez le code 2FA"
        style="width: 100%; margin: 15px 0; padding: 10px; font-size: 16px; text-align: center; letter-spacing: 0.3em;" />
      <button id="submit-2fa" style="padding: 10px 15px; background-color: #3b82f6; color: white; border: none; border-radius: 5px; width: 100%; font-size: 16px;">Valider</button>
      <button id="close-2fa" style="margin-top: 10px; padding: 10px 15px; background-color: #ef4444; color: white; border: none; border-radius: 5px; width: 100%; font-size: 16px;">Annuler</button>
    </div>
  `;

  return modal;
}

function handle2FActivation(user: any, modal: HTMLDivElement): Promise<void> {
  return new Promise((resolve) => {
    const submitBtn = modal.querySelector("#submit-2fa")!;
    const closeBtn = modal.querySelector("#close-2fa")!;
    const input = modal.querySelector<HTMLInputElement>("#twofa-code")!;

    submitBtn.addEventListener("click", () => {
      const code = input.value.trim();

      if (code !== "000000") {
        alert("Code 2FA incorrect, veuillez réessayer.");
        return;
      }

      const A2FStatus = authStorage.getA2F();

      if (A2FStatus) {
        authStorage.setA2F(false);
      } else {
        authStorage.setA2F(true);
      }

      document.body.removeChild(modal);
      resolve(); // Résout la promesse lorsque le code est correct
    });

    closeBtn.addEventListener("click", () => {
      document.body.removeChild(modal);
      resolve(); // Résout également la promesse si l'utilisateur annule
    });
  });
}




function handle2FAValidation(user: any, modal: HTMLDivElement) {
  const submitBtn = modal.querySelector("#submit-2fa")!;
  const closeBtn = modal.querySelector("#close-2fa")!;
  const input = modal.querySelector<HTMLInputElement>("#twofa-code")!;

  submitBtn.addEventListener("click", () => {
    const code = input.value.trim();

    if (code !== "000000") {
      alert("Code 2FA incorrect, veuillez réessayer.");
      return;
    }

    if (user) {
      authStorage.saveUser(user);
    }

    // Code correct, simule la réception du token
    const token = authStorage.getUserValue<string>("token");
    if (token) {
      authStorage.saveToken(token);
    } else {
      console.error("Token is null, cannot save.");
      return;
    }

    document.body.removeChild(modal);
    navigateTo("home");
  });

  closeBtn.addEventListener("click", () => {
    document.body.removeChild(modal);
  });
}

function show2FAModal(user: any = null) {
  const modal = create2FAModal();
  document.body.appendChild(modal);
  handle2FAValidation(user, modal);
}
