import { createCustomButton } from "@components/Buttons/CustomButton.ts";
import * as authStorage from "@utils/authStorage.ts";
import { t } from "@utils/i18n";
import * as db_utils from "@utils/db_utils";

export function createSignUpForm(
  onSuccess: (user: any) => void
): HTMLFormElement {
  const username_tag = t("username");
  const pw = t("pw");
  const signup = t("signup");

  const form = document.createElement("form");
  form.className =
    "absolute top-0 left-0 w-full transition-transform duration-500 ease-in-out";
  form.style.transform = "translateX(100%)";

  form.innerHTML = `
    <h2 class="text-2xl font-bold text-center text-green-600 mb-6">${signup}</h2>
    <input type="text" name="username" placeholder="${username_tag}" required minlength="3" maxlength="20"
      style="width: calc(100% - 5px);"
      class="invalid:border-red-500 invalid:text-red-500 mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400" />
    <input type="email" name="email" placeholder="Email" required
      style="width: calc(100% - 5px);"
      class="invalid:border-red-500 invalid:text-red-500 mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400" />
    <input type="password" name="password" placeholder="${pw}" required minlength="8"
      style="width: calc(100% - 5px);"
      class="invalid:border-red-500 invalid:text-red-500 mb-6 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400" />
  `;

  const submitBtn = createCustomButton({
    text: t("signup"),
    backgroundColor: "bg-green-600",
    textColor: "text-white",
    fontSizeClass: "text-md",
    width: "100%",
    height: "40px",
    borderWidth: "0",
  });
  submitBtn.type = "submit";
  form.appendChild(submitBtn);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await db_utils.addUser(email, username, password);

      onSuccess(authStorage.getUser());
    } catch (error) {
      console.error("❌ Erreur simulée :", error);
      alert(t("alertsignup"));
    }
  });

  return form;
}
