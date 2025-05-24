import { createCustomButton } from "../../components/Buttons/CustomButton.ts";
import * as authStorage from '../../utils/authStorage';
import { navigateTo } from "../../router.ts";

export function createSignUpForm(onSuccess: (user: any) => void): HTMLFormElement {
  const form = document.createElement("form");
  form.className = "absolute top-0 left-0 w-full transition-transform duration-500 ease-in-out";
  form.style.transform = "translateX(100%)";

  form.innerHTML = `
    <h2 class="text-2xl font-bold text-center text-green-600 mb-6">Inscription</h2>
    <input type="text" name="username" placeholder="Nom d'utilisateur" required minlength="3" maxlength="20"
      style="width: calc(100% - 5px);"
      class="mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400" />
    <input type="email" name="email" placeholder="Email" required
      style="width: calc(100% - 5px);"
      class="mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400" />
    <input type="password" name="password" placeholder="Mot de passe" required minlength="8"
      style="width: calc(100% - 5px);"
      class="mb-6 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400" />
  `;

  const submitBtn = createCustomButton({
    text: "S'inscrire",
    backgroundColor: "bg-green-600",
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
    const email = formData.get("email") as string;
    //const password = formData.get("password") as string;

    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simuler une réponse utilisateur de l'API
      const mockUser = {
        id: Math.floor(Math.random() * 10000),
        username,
        email,
        token: "fake-jwt-token-" + Date.now(),
      };

      console.log("✅ Utilisateur simulé reçu :", mockUser);

      // Stockage dans localStorage
		authStorage.saveToken(mockUser.token);
		authStorage.saveUser(mockUser);


      console.log("📦 Stockage local effectué :");
      console.log("🔑 Token :", authStorage.getToken());
      console.log("👤 User :", authStorage.getUser());

      // Callback succès
      onSuccess(mockUser);
    } catch (error) {
      console.error("❌ Erreur simulée :", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  });

  return form;
}

		//try {
		//  const response = await fetch("https://TON_DOMAINE_API/auth/register", {
		//    method: "POST",
		//    headers: {
		//      "Content-Type": "application/json",
		//    },
		//    body: JSON.stringify({ username, email, password }),
		//  });

		//  if (!response.ok) {
		//    const err = await response.json();
		//    alert("Erreur à l'inscription : " + (err.message || "Vérifie les champs"));
		//    return;
		//  }

		//  const user = await response.json();

		//  localStorage.setItem("token", user.token);
		//  localStorage.setItem("user", JSON.stringify(user));

		//  onSuccess(user);
		//} catch (error) {
		//  console.error("Erreur réseau ou serveur :", error);
		//  alert("Une erreur est survenue. Veuillez réessayer.");
		//}
