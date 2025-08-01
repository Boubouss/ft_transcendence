import { createCustomButton } from "@/components/Buttons/CustomButton.ts";
import { handlePostLogin } from "./A2F.ts";
import * as authStorage from "@utils/authStorage.ts";
import { t } from "@utils/i18n";
import { loginUser } from "@/utils/db_utils.ts";
import { type User_T } from "@utils/authStorage.ts";

export function createSignInForm(onSuccess: (user: User_T) => void): HTMLFormElement {
  const loginin = t("loginin");
  const name_tag = t("username");
  const pw = t("pw");

  const form = document.createElement("form");
  form.className = "absolute top-0 left-0 w-full transition-transform duration-500 ease-in-out flex flex-col";
  form.style.transform = "translateX(0)";
  form.innerHTML = `
    <h2 class="text-2xl font-bold text-center text-black-600 mb-6">${loginin}</h2>
    <input
  type="text"
  name="name"
  placeholder="${name_tag}"
  required
  minlength="3"
  maxlength="20"
  title="Le nom d'utilisateur doit contenir uniquement des lettres, chiffres ou underscores, entre 3 et 20 caractères."
  class=" mb-4 w-full px-4 py-2 border-2 border-black bg-[#FFFFFF99] rounded-[10px] focus:outline-none"
/>

   <input
  type="password"
  name="password"
  placeholder="${pw}"
  required
  minlength="8"
  title="Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un caractère spécial."
  class="mb-6 px-4 w-full py-2 border-2 border-black rounded-[10px] bg-[#FFFFFF99] focus:outline-none"
/>

  `;

  const submitBtn = createCustomButton({
    text: t("loginin"),
    backgroundColor: "bg-amber-100",
    textColor: "text-black",
    fontSizeClass: "text-md",
    borderRadius: "border-2 rounded-[20px]",
    borderColor: "border-black",
    height: "40px",
    padding: "p-[25px]",
    borderWidth: "0",
  });
  submitBtn.type = "submit";

  form.appendChild(submitBtn);

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;

    try {
      const user = await loginUser(name, password);

      const twoFAActive = authStorage.getA2FfromConfig() ?? false;

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
