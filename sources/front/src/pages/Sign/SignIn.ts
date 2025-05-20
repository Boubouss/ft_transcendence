import { createCustomButton } from "@components/Buttons/CustomButton.ts";
import { handlePostLogin } from "./A2F.ts";
import * as authStorage from "@utils/authStorage.ts";
import { t } from "@utils/i18n";
import { loginUser } from "@/utils/db_utils.ts";

export function createSignInForm(onSuccess: (user: any) => void): HTMLFormElement {
  const signin = t("signin");
  const username_tag = t("username");
  const pw = t("pw");

  const form = document.createElement("form");
  form.className = "absolute top-0 left-0 w-full transition-transform duration-500 ease-in-out";
  form.style.transform = "translateX(0)";
  form.innerHTML = `
    <h2 class="text-2xl font-bold text-center text-blue-600 mb-6">${signin}</h2>
    <input type="text" name="username" placeholder="${username_tag}" required minlength="3" maxlength="20"
      class="invalid:border-red-500 invalid:text-red-500 mb-4 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
    <input type="password" name="password" placeholder="${pw}" required minlength="8"
      class="invalid:border-red-500 invalid:text-red-500 mb-6 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
  `;

  const submitBtn = createCustomButton({
    text: t("signin"),
    backgroundColor: "bg-blue-600",
    textColor: "text-white",
    fontSizeClass: "text-md",
    width: "100%",
    height: "40px",
    borderWidth: "0",
  });
  submitBtn.type = "submit";

  form.appendChild(submitBtn);

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const formData = new FormData(form);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      // Appel à la fonction loginUser pour la connexion réelle
      const user = await loginUser(username, password);

      // Vérifier si 2FA est activé dans le stockage
      const twoFAActive = authStorage.getA2F() ?? false;

      // Gérer la connexion post login
      handlePostLogin(user, twoFAActive);
      onSuccess(user);

    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      alert(error instanceof Error ? error.message : "Erreur réseau ou serveur, veuillez réessayer.");
    }
  });

  return form;
}
