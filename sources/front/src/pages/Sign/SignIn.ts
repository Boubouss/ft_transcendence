import { createCustomButton } from "../../components/Buttons/CustomButton.ts";
import { handlePostLogin } from "./A2F.ts";

export function createSignInForm(onSuccess: (user: any) => void): HTMLFormElement {
  const form = document.createElement("form");
  form.className = "absolute top-0 left-0 w-full transition-transform duration-500 ease-in-out";
  form.style.transform = "translateX(0)";
  form.innerHTML = `
    <h2 class="text-2xl font-bold text-center text-blue-600 mb-6">Connexion</h2>
    <input type="text" name="username" placeholder="Nom d'utilisateur" required minlength="3" maxlength="20"
      class="mb-4 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
    <input type="password" name="password" placeholder="Mot de passe" required minlength="8"
      class="mb-6 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
  `;

  const submitBtn = createCustomButton({
    text: "Se connecter",
    backgroundColor: "bg-blue-600",
    textColor: "text-white",
    fontStyle: "font-semibold",
    fontSizeClass: "text-md",
    width: "100%",
    height: "40px",
    borderWidth: "border-0",
  });
  submitBtn.type = "submit";

  form.appendChild(submitBtn);

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const formData = new FormData(form);
    const username = formData.get("username") as string;
    //const password = formData.get("password") as string;

    try {
      // Simule l'appel API avec deux cas : 2FA actif ou pas (ici aléatoire)
      await new Promise(r => setTimeout(r, 800)); // latence simulée

      const twoFAActive = Math.random() < 0.5; // 50% de chances

      if (!twoFAActive) {
        // 2FA inactif : réponse complète avec token
        const user = {
          id: 123,
          username,
          email: username + "@exemple.com",
          token: "fake-jwt-token-" + Date.now(),
        };
        console.log("Connexion sans 2FA, user:", user);
        handlePostLogin(user, false);
		onSuccess(user);
      } else {
        // 2FA actif : réponse sans token
        const user = {
          id: 123,
          username,
          email: username + "@exemple.com",
          // pas de token ici
        };
        console.log("Connexion avec 2FA, user:", user);
        handlePostLogin(user, true);
      	onSuccess(user);
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      alert("Erreur réseau ou serveur, veuillez réessayer.");
    }
  });

  return form;
}
