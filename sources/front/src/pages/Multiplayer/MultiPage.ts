import { createCustomButton } from "@/components/Buttons/CustomButton";

export function renderMultiPage() {
  const appRoot = document.getElementById("app-root");
  if (!appRoot) return;

  appRoot.innerHTML = "";

  const app = document.createElement("div");
  app.className = "relative h-screen w-screen overflow-hidden";

  // === Fond d'écran flouté ===
  const background = document.createElement("div");
  background.className = `
    absolute inset-0 -z-10
    bg-[url('/assets/images/main-menu_background.jpg')]
    bg-cover bg-center
    sm:bg-[length:110%_160%]
    bg-[length:150%_180%]
    blur-sm
  `;

  // === Conteneur des éléments centrés ===
  const buttonContainer = document.createElement("div");
  buttonContainer.className = `
     absolute left-4/6 top-4/10 inset-0 flex flex-col  gap-6
  `;

  // === Bouton "Créer une partie" ===
  const createButton = createCustomButton({
    text: "Créer une partie",
    width: "280px",
    height: "120px",
    backgroundColor: "bg-yellow-600",
    textColor: "text-black",
    fontStyle: "font-jaro",
    fontSizeClass: "text-5xl",
    onClick: () => {
      console.log("→ Créer une partie");
      // Code pour initier la partie ici
    },
  });

  const serverlist = document.createElement("div");
  serverlist.className = `
    absolute inset-0 -z-20
    bg-orange-500
    bg-cover bg-center
  	w-[500px]
	h-[300px]
	left-2/6 top-2/10
	rounded-[20px]
	`;

  app.appendChild(serverlist);
  buttonContainer.appendChild(createButton);
  app.appendChild(buttonContainer);
  appRoot.appendChild(app);
}
