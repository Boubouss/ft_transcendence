import { createCloseModalButton } from "@/components/Buttons/AccountButtons";
import { createCustomButton } from "@/components/Buttons/CustomButton";
import { t } from "@/utils/i18n";
import { navigateTo } from "@/router";

export function renderMultiPage() {
  const appRoot = document.getElementById("app-root");
  if (!appRoot) return;

  appRoot.innerHTML = "";

  const app = document.createElement("div");
  app.className = "relative h-screen w-screen overflow-hidden";

  // Fond d'écran flouté
  const background = document.createElement("div");
  background.className = `
    absolute inset-0
    bg-[url('/assets/images/main-menu_background.jpg')]
    bg-cover bg-center
    sm:bg-[length:110%_160%]
    bg-[length:150%_180%]
    blur-sm
  `;

  // Bouton "Créer une partie"
  const buttonContainer = document.createElement("div");
  buttonContainer.className = `
    absolute sm:left-7/10 sm:top-2/5 left-3/10 bottom-1/30 flex flex-col gap-6
  `;

  const createButton = createCustomButton({
    text: "Créer une \npartie",
    width: "sm:280px 120px",
    height: "sm:120px 50px",
    backgroundColor: "bg-orange-400",
    textColor: "text-black",
    fontStyle: "font-jaro",
    fontSizeClass: "sm:text-6xl text-3xl whitespace-pre-line",
    padding: "p-2",
    onClick: () => {
      console.log("→ Créer une partie");
    },
  });

  buttonContainer.appendChild(createButton);

  const buttonCloseContainer = document.createElement("div");
  buttonCloseContainer.className = `
    absolute sm:right-1/10 sm:top-1/10  right-1/10 top-1/30 flex flex-col gap-6
  `;

  const CloseButton = createCloseModalButton(() => {
      navigateTo("/");
    });


  buttonCloseContainer.appendChild(CloseButton);

  // Conteneur principal du lobby
  const containerLobby = document.createElement("div");
  containerLobby.style.fontFamily = "'Jaro', sans-serif";
  containerLobby.className = `
    absolute
    left-[12%] top-[10%]
    sm:w-[35%] sm:h-[80%] w-[75%] h-[75%]
    bg-orange-400
    rounded-[20px]
    border-2 border-black
    flex flex-col
    pt-4
    px-6
  `;

  // Titre
  const title = document.createElement("h2");
  title.textContent = t("lobbylist");
  title.className = `
    font-jaro
    sm:text-8xl text-3xl
    text-center
    mb-2
  `;

  // Séparateur
  const divide = document.createElement("div");
  divide.className = `
    w-full
    h-1
    bg-black
    mb-4
  `;

  // Liste des lobbies
  const lobbyList = document.createElement("div");
  lobbyList.style.fontFamily = "'Jaro', sans-serif";
  lobbyList.className = `
    w-full
    bg-orange-600
    mb-[5%]
    rounded-[20px]
    border-2 border-black
    flex flex-col
    overflow-x-scroll
    px-2
  `;

  // On ajoute les lobbies
  const lobbies = [
    "Lobby Alpha",
    "Lobby Bravo",
    "Lobby Charlie",
    "Lobby Delta",
    "Lobby Alpha",
    "Lobby Bravo",
    "Lobby Charlie",
    "Lobby Delta",
    "Lobby Alpha",
    "Lobby Bravo",
    "Lobby Charlie",
    "Lobby Delta",
    "Lobby Charlie",
    "Lobby Delta",
  ];

  lobbies.forEach((lobbyName, index) => {
    const block = document.createElement("div");
    block.className = "w-full flex flex-col";

    const lobbyItem = document.createElement("div");
    lobbyItem.textContent = lobbyName;
    lobbyItem.className = `
      w-full
      sm:text-2xl text-1xl
      text-black
      py-4 px-6
      font-jaro
      hover:bg-orange-500
      cursor-pointer
    `;

    block.appendChild(lobbyItem);

    if (index < lobbies.length - 1) {
      const separator = document.createElement("div");
      separator.className = "w-full h-[2px] bg-black opacity-50";
      block.appendChild(separator);
    }

    lobbyList.appendChild(block);
  });

  // Assemblage des éléments dans containerLobby
  containerLobby.appendChild(title);
  containerLobby.appendChild(divide);
  containerLobby.appendChild(lobbyList);

  // Ajout à app
  app.appendChild(background);
  app.appendChild(containerLobby);
  app.appendChild(buttonContainer);
  app.appendChild(buttonCloseContainer);
  appRoot.appendChild(app);



}


