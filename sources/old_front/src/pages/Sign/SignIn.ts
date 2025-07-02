import { createCustomButton } from "@/components/Buttons/CustomButton";
import * as authStorage from "@utils/authStorage.ts";
import { t } from "@utils/i18n";
import * as db_utils from "@utils/db_utils";
import { type User_T } from "@utils/authStorage.ts";

export function createSignUpForm(
  onSuccess: (user: User_T | null)  => void
): HTMLFormElement {
  const name_tag = t("username");
  const pw = t("pw");
  const signin = t("signin");

  const form = document.createElement("form");
  form.className =
    "absolute top-0 left-0 w-full transition-transform duration-500 ease-in-out";
  form.style.transform = "translateX(100%)";

  form.innerHTML = `
    <h2 class="text-2xl font-bold text-center text-black-600 mb-6">${signin}</h2>
   <input
  type="text"
  name="name"
  placeholder="${name_tag}"
  required
  minlength="3"
  maxlength="20"
  pattern="^[a-zA-Z0-9_]+$"
  title="Le nom d'utilisateur doit contenir uniquement des lettres, chiffres ou underscores, entre 3 et 20 caractères."
  class=" valid:text-green-500 mb-4 w-full px-4 py-2  bg-[#FFFFFF99] border-2 border-black rounded-[10px]  focus:outline-none"
/>

<input type="email" name="email" placeholder="Email" required
  style="width: calc(100% - 5px);"
  class=" valid:text-green-500 mb-4 px-4 py-2 bg-[#FFFFFF99] border-2 border-black rounded-[10px] focus:outline-none" />
<input
  type="password"import fs from 'fs';

  name="password"
  placeholder="${pw}"
  required
  minlength="8"
  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$"
  title="Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un caractère spécial."
  style="width: calc(100% - 5px);"
  class=" valid:text-green-500 text mb-6 px-4 py-2 bg-[#FFFFFF99] border-2 border-black rounded-[10px] focus:outline-none"
/>

  `;

  const submitBtn = createCustomButton({
    text: t("signin"),
    backgroundColor: "bg-amber-100",
    textColor: "text-black",
    borderRadius: "rounded-[20px] border-2",
    borderColor: "border-black",
    fontSizeClass: "text-md",
    height: "40px",
    padding: "p-[25px]",
    borderWidth: "0",
  });
  submitBtn.type = "submit";
  form.appendChild(submitBtn);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await db_utils.addUser(email, name, password);

      onSuccess(authStorage.getUser());
    } catch (error) {
      console.error("❌ Erreur simulée :", error);
      alert(t("alertsignup"));
    }
  });

  return form;
}
